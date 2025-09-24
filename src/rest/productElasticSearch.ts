class ProductElasticSearch {
  async getProducts(
    productName: string,
    page: number = 1,
    size: number = 10,
    categoryName: string // categoria que vem do banco
  ) {
    // Monta a query do Elasticsearch
    const esQuery = {
      from: (page - 1) * size,
      size: size,
      query: {
        bool: {
          must: [
            {
              match_phrase: {
                name: {
                  query: productName,
                  slop: 2 // Permite pequena flexibilidade na ordem/frase
                }
              }
            }
          ],
          should: [
            {
              match: {
                name: {
                  query: productName,
                  boost: 2.0 // Aumenta peso para correspondências próximas
                }
              }
            },
            {
              term: {
                "name.keyword": productName // Correspondência exata para o nome
              }
            }
          ],
          minimum_should_match: 1,
          filter: [
            {
              term: {
                "categoryName.keyword": categoryName // Filtro exato por categoria
              }
            }
          ]
        }
      },
      min_score: 0.5 // Limiar mínimo de relevância
    };
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
