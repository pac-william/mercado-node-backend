class ProductElasticSearch {
  async getProducts(
    productName: string,
    page: number = 1,
    size: number = 10,
    categoryName: string // categoria que vem do banco
  ) {
    // Monta a query do Elasticsearch

    let esQuery;

    if (categoryName) {
      esQuery = {
        from: (page - 1) * size,
        size: size,
        query: {
          bool: {
            must: [
              {
                match: {
                  name: {
                    query: productName,
                    fuzziness: "AUTO" // apenas para nome do produto
                  }
                }
              }
            ],
            filter: [
              {
                term: {
                  "categoryName.keyword": categoryName // filtro exato
                }
              }
            ]
          }
        }
      };

    } else {
      esQuery = {
        from: (page - 1) * size,
        size: size,
        query: {
          bool: {
            must: [
              {
                match: {
                  name: {
                    query: productName,
                    fuzziness: "AUTO" // apenas para nome do produto
                  }
                }
              }
            ]
          }
        }
      };
    }

    // Chamada ao Elasticsearch
    const response = await fetch(`${process.env.ELASTICSEARCH_URL}/produtos/_search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(esQuery)
    });

    if (!response.ok) {
      throw new Error(`Erro Elasticsearch: ${response.status} - ${await response.text()}`);
    }

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
