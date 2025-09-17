import { Deliverer } from "../domain/delivererDomain";
import { DelivererDTO, DelivererUpdateDTO } from "../dtos/delivererDTO";
import { prisma } from "../utils/prisma";

class DelivererRepository {
    async createDeliverer(delivererDTO: DelivererDTO) {
        const deliverer = await prisma.deliverer.create({
            data: delivererDTO,
        });
        return deliverer;
    }

    async getDeliverers(page: number, size: number, status?: string) {
        const deliverers = await prisma.deliverer.findMany({
            where: {
                status: status as any,
            },
            skip: (page - 1) * size,
            take: size,
            orderBy: {
                name: 'asc',
            }
        });
        return deliverers.map((deliverer) => new Deliverer(
            deliverer.id,
            deliverer.name,
            deliverer.document,
            deliverer.phone,
            deliverer.status,
            {
                type: deliverer.vehicle.type,
                plate: deliverer.vehicle.plate ?? undefined,
                description: deliverer.vehicle.description ?? undefined,
            },
        ));
    }

    async getDelivererById(id: string) {
        const deliverer = await prisma.deliverer.findUnique({
            where: { id },
        });
        return deliverer;
    }

    async updateDeliverer(id: string, delivererDTO: DelivererDTO) {
        const deliverer = await prisma.deliverer.update({
            where: { id },
            data: delivererDTO,
        });
        return deliverer;
    }

    async updateDelivererPartial(id: string, delivererUpdateDTO: DelivererUpdateDTO) {
        const deliverer = await prisma.deliverer.update({
            where: { id },
            data: delivererUpdateDTO,
        });
        return deliverer;
    }

    async deleteDeliverer(id: string) {
        const deliverer = await prisma.deliverer.update({
            where: { id },
            data: { status: "INACTIVE" },
        });
        return deliverer;
    }

    async countDeliverers(status?: string) {
        const count = await prisma.deliverer.count({
            where: {
                status: status as any,
            },
        });
        return count;
    }

    async getActiveDeliverers() {
        const deliverers = await prisma.deliverer.findMany({
            where: { status: "ACTIVE" },
            orderBy: { name: 'asc' },
        });
        return deliverers;
    }
}

export const delivererRepository = new DelivererRepository();
