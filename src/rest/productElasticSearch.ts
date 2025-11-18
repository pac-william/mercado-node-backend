class ProductElasticSearch {
  private getAuthHeader() {
    const token = process.env.ELASTIC_CLOUD_API_KEY
      ? `ApiKey ${process.env.ELASTIC_CLOUD_API_KEY}`
      : (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD
        ? `Basic ${Buffer.from(`${process.env.ELASTIC_USERNAME}:${process.env.ELASTIC_PASSWORD}`).toString("base64")}`
        : "");

    if (!token) {
      throw new Error("Elasticsearch credentials missing: set ELASTIC_CLOUD_API_KEY or ELASTIC_USERNAME/ELASTIC_PASSWORD");
    }

    return token;
  }

  async getProducts(
    productName: string,
    page: number = 1,
    size: number = 10,
    categoryNames: string[] = [],
    marketId?: string
  ) {
    const filters: any[] = [];

    if (categoryNames.length > 0) {
      filters.push({
        terms: {
          "categoryName.keyword": categoryNames
        }
      });
    }

    if (marketId) {
      filters.push({
        term: {
          "marketId.keyword": marketId
        }
      });
    }

    const esQuery: any = {
      from: (page - 1) * size,
      size: size,
      query: {
        bool: {
          must: [
            {
              match: {
                name: {
                  query: productName,
                  fuzziness: "AUTO"
                }
              }
            }
          ]
        }
      }
    };

    if (filters.length > 0) {
      esQuery.query.bool.filter = filters;
    }

    const AUTH_HEADER = this.getAuthHeader();

    const response = await fetch(`${process.env.ELASTICSEARCH_URL}/produtos/_search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": AUTH_HEADER },
      body: JSON.stringify(esQuery)
    });

    if (!response.ok) {
      throw new Error(`Erro Elasticsearch: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const products = (data.hits?.hits || []).map((hit: any) => hit._source);

    return {
      products,
      meta: {
        total: data.hits?.total?.value ?? 0,
        page,
        size
      }
    };
  }

  async indexProduct(product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    marketId: string;
    image?: string | null;
    categoryId?: string | null;
    categoryName?: string | null;
    sku?: string | null;
  }) {
    if (!process.env.ELASTICSEARCH_URL) {
      return;
    }

    const AUTH_HEADER = this.getAuthHeader();

    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      marketId: product.marketId,
      image: product.image ?? null,
      categoryId: product.categoryId ?? null,
      categoryName: product.categoryName ?? null,
      sku: product.sku ?? null,
    };

    const response = await fetch(`${process.env.ELASTICSEARCH_URL}/produtos/_doc/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": AUTH_HEADER },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro ao indexar produto no Elasticsearch: ${response.status} - ${await response.text()}`);
    }
  }
}

export const productElasticSearch = new ProductElasticSearch();
