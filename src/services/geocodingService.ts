import { Logger } from "../utils/logger";
import { GeocodeDTO, GeocodeReverseDTO } from "../dtos/geocodingDTO";

interface GeocodeResult {
    latitude: number;
    longitude: number;
    address: string;
    formattedAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

interface ReverseGeocodeResult {
    address: string;
    formattedAddress?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    latitude: number;
    longitude: number;
}

class GeocodingService {
    private readonly NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
    private readonly USER_AGENT = "MercadoApp/1.0";

    private readonly STATE_TO_UF_MAP: Record<string, string> = {
        "Acre": "AC",
        "Alagoas": "AL",
        "Amapá": "AP",
        "Amazonas": "AM",
        "Bahia": "BA",
        "Ceará": "CE",
        "Distrito Federal": "DF",
        "Espírito Santo": "ES",
        "Goiás": "GO",
        "Maranhão": "MA",
        "Mato Grosso": "MT",
        "Mato Grosso do Sul": "MS",
        "Minas Gerais": "MG",
        "Pará": "PA",
        "Paraíba": "PB",
        "Paraná": "PR",
        "Pernambuco": "PE",
        "Piauí": "PI",
        "Rio de Janeiro": "RJ",
        "Rio Grande do Norte": "RN",
        "Rio Grande do Sul": "RS",
        "Rondônia": "RO",
        "Roraima": "RR",
        "Santa Catarina": "SC",
        "São Paulo": "SP",
        "Sergipe": "SE",
        "Tocantins": "TO",
    };

    private convertStateToUF(stateName?: string): string | undefined {
        if (!stateName) return undefined;
        
        const trimmedState = stateName.trim();
        if (trimmedState.length === 2 && /^[A-Z]{2}$/i.test(trimmedState)) {
            return trimmedState.toUpperCase();
        }
        
        const normalizedState = trimmedState
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
        
        for (const [fullName, uf] of Object.entries(this.STATE_TO_UF_MAP)) {
            const normalizedFullName = fullName
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            
            if (normalizedState === normalizedFullName) {
                return uf;
            }
        }
        
        for (const [fullName, uf] of Object.entries(this.STATE_TO_UF_MAP)) {
            const normalizedFullName = fullName
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            
            if (normalizedState.includes(normalizedFullName) && normalizedFullName.length >= 5) {
                return uf;
            }
            
            if (normalizedFullName.includes(normalizedState) && normalizedState.length >= 5) {
                return uf;
            }
        }
        
        return undefined;
    }

    async geocode(data: GeocodeDTO): Promise<GeocodeResult> {
        try {
            const encodedAddress = encodeURIComponent(data.address);
            const url = `${this.NOMINATIM_BASE_URL}/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.USER_AGENT,
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na API de geocoding: ${response.statusText}`);
            }

            const results = await response.json() as Array<{
                lat: string;
                lon: string;
                display_name: string;
                address?: {
                    city?: string;
                    state?: string;
                    country?: string;
                    postcode?: string;
                    road?: string;
                    house_number?: string;
                };
            }>;

            if (!results || results.length === 0) {
                throw new Error("Endereço não encontrado");
            }

            const result = results[0];
            const latitude = parseFloat(result.lat);
            const longitude = parseFloat(result.lon);

            if (isNaN(latitude) || isNaN(longitude)) {
                throw new Error("Coordenadas inválidas retornadas pela API");
            }

            const address: any = result.address || {};
            const formattedAddress = this.formatAddress(address, result.display_name);
            const stateUF = this.convertStateToUF(address.state);
            return {
                latitude,
                longitude,
                address: result.display_name,
                formattedAddress,
                city: address.city || address.town || address.village,
                state: stateUF || address.state,
                country: address.country,
                zipCode: address.postcode,
            };
        } catch (error) {
            throw error instanceof Error ? error : new Error("Erro ao buscar coordenadas do endereço");
        }
    }

    async reverseGeocode(data: GeocodeReverseDTO): Promise<ReverseGeocodeResult> {
        try {
            const url = `${this.NOMINATIM_BASE_URL}/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=18&addressdetails=1`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': this.USER_AGENT,
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na API de geocoding reverso: ${response.statusText}`);
            }

            const result = await response.json() as {
                lat: string;
                lon: string;
                display_name: string;
                address?: {
                    city?: string;
                    state?: string;
                    country?: string;
                    postcode?: string;
                    road?: string;
                    house_number?: string;
                    suburb?: string;
                    neighbourhood?: string;
                };
            };

            if (!result || !result.display_name) {
                throw new Error("Endereço não encontrado para as coordenadas fornecidas");
            }

            const latitude = parseFloat(result.lat);
            const longitude = parseFloat(result.lon);

            if (isNaN(latitude) || isNaN(longitude)) {
                throw new Error("Coordenadas inválidas retornadas pela API");
            }

            const address: any = result.address || {};
            const formattedAddress = this.formatAddress(address, result.display_name);
            const stateUF = this.convertStateToUF(address.state);
            
            return {
                address: result.display_name,
                formattedAddress,
                street: address.road || "",
                number: address.house_number || "",
                neighborhood: address.suburb || address.neighbourhood || "",
                city: address.city || address.town || address.village || address.suburb || address.neighbourhood,
                state: stateUF || address.state,
                country: address.country,
                zipCode: address.postcode,
                latitude,
                longitude,
            };
        } catch (error) {
            throw error instanceof Error ? error : new Error("Erro ao buscar endereço das coordenadas");
        }
    }

    private formatAddress(address: any, displayName: string): string {
        const parts: string[] = [];
        
        if (address.house_number && address.road) {
            parts.push(`${address.road}, ${address.house_number}`);
        } else if (address.road) {
            parts.push(address.road);
        }
        
        if (address.suburb || address.neighbourhood) {
            parts.push(address.suburb || address.neighbourhood);
        }
        
        if (address.city || address.town || address.village) {
            parts.push(address.city || address.town || address.village);
        }
        
        if (address.state) {
            parts.push(address.state);
        }
        
        if (address.postcode) {
            parts.push(address.postcode);
        }
        
        if (address.country) {
            parts.push(address.country);
        }
        
        return parts.length > 0 ? parts.join(", ") : displayName;
    }
}

export const geocodingService = new GeocodingService();

