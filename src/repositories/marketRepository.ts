import { Market } from "../domain/marketDomain";
import { MarketDTO, MarketUpdateDTO } from "../dtos/marketDTO";
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

    async getMarkets(page: number, size: number, name?: string, address?: string, ownerId?: string, managersIds?: string[]) {
        const whereClause: any = {};
        
        if (ownerId) {
            whereClause.ownerId = ownerId;
        } else {
            whereClause.ownerId = { not: null };
        }
        
        if (name) {
            whereClause.name = { contains: name };
        }
        
        if (managersIds && managersIds.length > 0) {
            whereClause.managersIds = { hasSome: managersIds };
        }
        
        const marketsRaw = await prisma.market.findMany({
            where: whereClause,
            include: {
                address: true
            },
            skip: (page - 1) * size,
            take: size,
        });

        return marketsRaw.map((market: any) => {
            const addressString = market.address 
                ? `${market.address.street}, ${market.address.number}${market.address.complement ? ` - ${market.address.complement}` : ''} - ${market.address.neighborhood}, ${market.address.city} - ${market.address.state}`
                : '';
            
            return new Market(
                market.id,
                market.name,
                addressString,
                market.profilePicture ?? '',
                market.ownerId,
                market.managersIds ?? [],
                market.createdAt,
                market.updatedAt,
            );
        });
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
        
        // Formatar endereço como string se existir
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
                userId: market.address.userId,
                marketId: market.address.marketId,
                name: market.address.name,
                street: market.address.street,
                number: market.address.number,
                complement: market.address.complement,
                neighborhood: market.address.neighborhood,
                city: market.address.city,
                state: market.address.state,
                zipCode: market.address.zipCode,
                isFavorite: market.address.isFavorite,
                isActive: market.address.isActive,
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
        // Se estiver atualizando o addressId, também atualizar o endereço para associar o marketId
        if (marketUpdateDTO.addressId) {
            return await prisma.$transaction(async (tx) => {
                // Verificar se o endereço existe
                const address = await tx.address.findUnique({
                    where: { id: marketUpdateDTO.addressId }
                });
                
                if (!address) {
                    throw new Error("Endereço não encontrado");
                }
                
                // Se o mercado já tinha um addressId diferente, remover o marketId do endereço antigo
                const currentMarket = await tx.market.findUnique({
                    where: { id },
                    select: { addressId: true }
                });
                
                if (currentMarket?.addressId && currentMarket.addressId !== marketUpdateDTO.addressId) {
                    await tx.address.update({
                        where: { id: currentMarket.addressId },
                        data: { marketId: null }
                    });
                }
                
                // Atualizar o mercado primeiro
                const market = await tx.market.update({
                    where: { id },
                    data: marketUpdateDTO,
                });
                
                // Atualizar o endereço para associar o marketId
                // Se o endereço já está associado a outro mercado, remover primeiro
                if (address.marketId && address.marketId !== id) {
                    await tx.address.update({
                        where: { id: marketUpdateDTO.addressId },
                        data: { marketId: null }
                    });
                }
                
                // Associar o marketId ao endereço
                await tx.address.update({
                    where: { id: marketUpdateDTO.addressId },
                    data: { marketId: id }
                });
                
                return market;
            });
        }
        
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
        const filter = this.buildFilter(name, address, ownerId, managersIds);

        const marketsRaw = await prisma.market.findRaw({
            filter,
        }) as unknown as any[];

        return marketsRaw.length;
    }
}

export const marketRepository = new MarketRepository();
