import { MarketDTO, MarketUpdateDTO } from "../dtos/marketDTO";
import { calculateDistanceInKm } from "../utils/distance";
import { prisma } from "../utils/prisma";

class MarketRepository {
    private buildFilter(name?: string, address?: string, ownerId?: string, managersIds?: string[]): any {
        const filter: any = {
            ownerId: { $ne: null, $exists: true }
        };

        if (ownerId) {
            filter.ownerId = { $oid: ownerId };
        }

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (address) {
            filter.address = { $regex: address, $options: 'i' };
        }

        if (managersIds && managersIds.length > 0) {
            filter.managersIds = { $in: managersIds.map(id => ({ $oid: id })) };
        }

        return filter;
    }

    async createMarket(marketDTO: MarketDTO) {
        const market = await prisma.market.create({
            data: marketDTO,
        });
        return market;
    }

    async getMarkets(
        page: number,
        size: number,
        name?: string,
        address?: string,
        ownerId?: string,
        managersIds?: string[],
        userLatitude?: number,
        userLongitude?: number,
        sort?: string,
        distance?: number
    ) {
        const whereClause: any = {};
        
        if (ownerId) {
            whereClause.ownerId = ownerId;
        }
        
        if (name) {
            whereClause.name = { contains: name };
        }
        
        if (managersIds && managersIds.length > 0) {
            whereClause.managersIds = { hasSome: managersIds };
        }
        
        // Fetch all markets first (we'll paginate after filtering and sorting)
        const marketsRaw = await prisma.market.findMany({
            where: whereClause,
            include: {
                address: true
            },
        });

        const hasUserLocation = typeof userLatitude === "number" && typeof userLongitude === "number";

        let markets = marketsRaw.map((market: any) => {
            const addressString = market.address 
                ? `${market.address.street}, ${market.address.number}${market.address.complement ? ` - ${market.address.complement}` : ''} - ${market.address.neighborhood}, ${market.address.city} - ${market.address.state}`
                : '';

            const latitude = market.address?.latitude ?? null;
            const longitude = market.address?.longitude ?? null;
            const calculatedDistance = hasUserLocation && latitude !== null && longitude !== null
                ? calculateDistanceInKm(userLatitude!, userLongitude!, latitude, longitude)
                : null;
            
            return {
                id: market.id,
                name: market.name,
                address: addressString,
                profilePicture: market.profilePicture ?? '',
                bannerImage: '',
                ownerId: market.ownerId,
                managersIds: market.managersIds ?? [],
                createdAt: market.createdAt,
                updatedAt: market.updatedAt,
                latitude,
                longitude,
                distance: calculatedDistance,
            };
        });

        // Filter by maximum distance if provided
        if (distance !== undefined && distance > 0) {
            markets = markets.filter((m) => m.distance !== null && m.distance <= distance);
        }

        // Sort markets
        if (sort) {
            switch (sort) {
                case 'distance':
                    if (hasUserLocation) {
                        markets.sort((a, b) => {
                            if (a.distance === null && b.distance === null) return 0;
                            if (a.distance === null) return 1;
                            if (b.distance === null) return -1;
                            return a.distance - b.distance;
                        });
                    }
                    break;
                case 'name':
                    markets.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'rating':
                    // Rating not implemented yet, fallback to name
                    markets.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'deliveryTime':
                    // Delivery time not implemented yet, fallback to name
                    markets.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    // Default sort by name
                    markets.sort((a, b) => a.name.localeCompare(b.name));
            }
        } else {
            // Default: sort by distance if user location available, otherwise by name
            if (hasUserLocation) {
                markets.sort((a, b) => {
                    if (a.distance === null && b.distance === null) return 0;
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                });
            } else {
                markets.sort((a, b) => a.name.localeCompare(b.name));
            }
        }

        return markets;
    }


    async getMarketById(id: string) {
        const market = await prisma.market.findUnique({
            where: { id },
            include: {
                address: true
            }
        });
        
        if (!market) {
            return null;
        }
        
        const addressString = market.address 
            ? `${market.address.street}, ${market.address.number}${market.address.complement ? ` - ${market.address.complement}` : ''} - ${market.address.neighborhood}, ${market.address.city} - ${market.address.state}`
            : '';
        
        return {
            id: market.id,
            name: market.name,
            address: addressString,
            addressId: market.addressId,
            addressData: market.address ? {
                id: market.address.id,
                marketId: market.address.marketId,
                name: market.address.name,
                street: market.address.street,
                number: market.address.number,
                complement: market.address.complement,
                neighborhood: market.address.neighborhood,
                city: market.address.city,
                state: market.address.state,
                zipCode: market.address.zipCode,
                latitude: market.address.latitude,
                longitude: market.address.longitude,
                createdAt: market.address.createdAt,
                updatedAt: market.address.updatedAt,
            } : null,
            profilePicture: market.profilePicture || '',
            ownerId: market.ownerId,
            managersIds: market.managersIds || [],
            createdAt: market.createdAt,
            updatedAt: market.updatedAt,
        };
    }

    async updateMarket(id: string, marketDTO: MarketDTO) {
        const market = await prisma.market.update({
            where: { id },
            data: marketDTO,
        });
        return market;
    }

    async updateMarketPartial(id: string, marketUpdateDTO: MarketUpdateDTO) {
        const market = await prisma.market.update({
            where: { id },
            data: marketUpdateDTO,
        });
        return market;
    }

    async deleteMarket(id: string) {
        const market = await prisma.market.delete({
            where: { id },
        });
        return market;
    }

    async count(name?: string, address?: string, ownerId?: string, managersIds?: string[]) {
        const whereClause: any = {};
        
        if (ownerId) {
            whereClause.ownerId = ownerId;
        }
        
        if (name) {
            whereClause.name = { contains: name };
        }
        
        if (managersIds && managersIds.length > 0) {
            whereClause.managersIds = { hasSome: managersIds };
        }

        return await prisma.market.count({
            where: whereClause,
        });
    }
}

export const marketRepository = new MarketRepository();
