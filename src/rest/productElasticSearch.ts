class ProductElasticSearch {
  async getProducts(query: string, page: number = 1, size: number = 10) {
    // Monta a query do Elasticsearch
    const esQuery = {
      from: (page - 1) * size,
      size: size,
      query: {
        multi_match: {
          query: query,
          fields: ["name", "category"],
          fuzziness: "AUTO"
        }
      }
    };

    /* const esQuery = {
      from: (page - 1) * size,
      size: size,
      query: {
        bool: {
          must: {
            multi_match: {
              query: query,
              fields: ["name^3", "category"]
            }
          },
          filter: {
            term: { category: "alimento" }
          }
        }
      }
    }; */

    // Chamada ao Elasticsearch
    const response = await fetch(`${process.env.ELASTICSEARCH_URL}/produtos/_search`, {
      method: "POST", // deve ser POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(esQuery)
    });

    const data = await response.json();

    // Extrai produtos
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
}

export const productElasticSearch = new ProductElasticSearch();


