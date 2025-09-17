import { Meta } from "../domain/metaDomain";
import { DelivererPaginatedResponse } from "../domain/delivererDomain";
import { DelivererDTO, DelivererUpdateDTO } from "../dtos/delivererDTO";
import { delivererRepository } from "../repositories/delivererRepository";

class DelivererService {
    async createDeliverer(delivererDTO: DelivererDTO) {
        return await delivererRepository.createDeliverer(delivererDTO);
    }

    async getDeliverers(page: number, size: number, status?: string) {
        const count = await delivererRepository.countDeliverers(status);
        const deliverers = await delivererRepository.getDeliverers(page, size, status);
        return new DelivererPaginatedResponse(deliverers, new Meta(page, size, count, Math.ceil(count / size), count));
    }

    async getDelivererById(id: string) {
        return await delivererRepository.getDelivererById(id);
    }

    async updateDeliverer(id: string, delivererDTO: DelivererDTO) {
        return await delivererRepository.updateDeliverer(id, delivererDTO);
    }

    async updateDelivererPartial(id: string, delivererUpdateDTO: DelivererUpdateDTO) {
        return await delivererRepository.updateDelivererPartial(id, delivererUpdateDTO);
    }

    async deleteDeliverer(id: string) {
        return await delivererRepository.deleteDeliverer(id);
    }

    async getActiveDeliverers() {
        return await delivererRepository.getActiveDeliverers();
    }
}

export const delivererService = new DelivererService();
