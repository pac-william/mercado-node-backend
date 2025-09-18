import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriasData = [
    // Categoria "Hortifruti"
    {
        name: 'Hortifruti',
        slug: 'hortifruti',
        description: 'Frutas, verduras e legumes frescos, direto da feira.',
        subCategories: [
            { name: 'Frutas', slug: 'frutas', description: 'Maçãs, bananas, laranjas e morangos.' },
            { name: 'Verduras e Folhas', slug: 'verduras-e-folhas', description: 'Alfaces, couve, rúcula e espinafre.' },
            { name: 'Legumes', slug: 'legumes', description: 'Cenouras, batatas, abóboras e brócolis.' },
        ],
    },
    // Categoria "Mercearia"
    {
        name: 'Mercearia',
        slug: 'mercearia',
        description: 'Itens essenciais para a sua despensa.',
        subCategories: [
            { name: 'Cereais e Grãos', slug: 'cereais-e-graos', description: 'Arroz, feijão, milho e lentilha.' },
            { name: 'Massas e Molhos', slug: 'massas-e-molhos', description: 'Macarrão, lasanha, molho de tomate e pesto.' },
            { name: 'Azeites, Óleos e Temperos', slug: 'azeites-oleos-e-temperos', description: 'Azeite de oliva, óleo de cozinha, sal e pimenta.' },
            { name: 'Doces e Guloseimas', slug: 'doces-e-guloseimas', description: 'Chocolates, biscoitos, balas e doces em geral.' },
        ],
    },
    // Categoria "Carnes e Aves"
    {
        name: 'Carnes e Aves',
        slug: 'carnes-e-aves',
        description: 'Cortez nobres, carnes de aves e outros tipos de carne para o seu churrasco ou refeição.',
        subCategories: [
            { name: 'Carnes Bovinas', slug: 'carnes-bovinas', description: 'Picanha, filé mignon, alcatra e contrafilé.' },
            { name: 'Aves', slug: 'aves', description: 'Frango inteiro, peito de frango e coxa de frango.' },
            { name: 'Peixes e Frutos do Mar', slug: 'peixes-e-frutos-do-mar', description: 'Salmão, tilápia, camarão e lula.' },
        ],
    },
    // Categoria "Laticínios e Frios"
    {
        name: 'Laticínios e Frios',
        slug: 'laticinios-e-frios',
        description: 'Queijos, iogurtes, leites e embutidos fresquinhos.',
        subCategories: [
            { name: 'Queijos', slug: 'queijos', description: 'Mussarela, queijo prato, queijo minas e parmesão.' },
            { name: 'Iogurtes e Leites', slug: 'iogurtes-e-leites', description: 'Leites integrais, desnatados e iogurtes naturais.' },
            { name: 'Embutidos', slug: 'embutidos', description: 'Presunto, mortadela, salame e peito de peru.' },
        ],
    },
    // Categoria "Bebidas"
    {
        name: 'Bebidas',
        slug: 'bebidas',
        description: 'Sucos, refrigerantes, águas, cervejas e vinhos.',
        subcategories: [
            { name: 'Sucos e Refrigerantes', slug: 'sucos-e-refrigerantes', description: 'Sucos de caixinha, sucos naturais e refrigerantes diversos.' },
            { name: 'Bebidas Alcoólicas', slug: 'bebidas-alcoolicas', description: 'Cervejas, vinhos, destilados e licores.' },
            { name: 'Águas', slug: 'aguas', description: 'Água mineral, água com gás e água de coco.' },
        ],
    },
    // Categoria "Limpeza"
    {
        name: 'Limpeza',
        slug: 'limpeza',
        description: 'Produtos para deixar a sua casa brilhando.',
        subCategories: [
            { name: 'Produtos para Casa', slug: 'produtos-para-casa', description: 'Sabão em pó, detergente, desinfetante e amaciante.' },
            { name: 'Limpeza de Cozinha', slug: 'limpeza-de-cozinha', description: 'Esponjas, panos de prato e desengordurantes.' },
            { name: 'Acessórios de Limpeza', slug: 'acessorios-de-limpeza', description: 'Vassouras, rodos e lixeiras.' },
        ],
    },
    // Categoria "Higiene e Beleza"
    {
        name: 'Higiene e Beleza',
        slug: 'higiene-e-beleza',
        description: 'Cuidados pessoais e beleza para o dia a dia.',
        subCategories: [
            { name: 'Cuidados com o Corpo', slug: 'cuidados-com-o-corpo', description: 'Sabonetes, shampoos, condicionadores e hidratantes.' },
            { name: 'Higiene Bucal', slug: 'higiene-bucal', description: 'Cremes dentais, escovas de dente e enxaguantes.' },
            { name: 'Maquiagem e Cosméticos', slug: 'maquiagem-e-cosmeticos', description: 'Maquiagem, cremes faciais e perfumes.' },
        ],
    },
];

async function main() {
    console.log('Iniciando o seeder de mercado...');

    for (const categoria of categoriasData) {
        const novaCategoria = await prisma.categories.create({
            data: {
                name: categoria.name,
                slug: categoria.slug,
                description: categoria.description,
                subCategories: categoria.subCategories,
            },
        });

        console.log(`Criada categoria: ${novaCategoria.name}`);
        if (categoria.subCategories) {
            for (const sub of categoria.subCategories) {
                console.log(`  - Subcategoria: ${sub.name}`);
            }
        }
    }

    console.log('Seeder de mercado concluído com sucesso.');
}

main()
    .catch((e) => {
        console.error('Ocorreu um erro ao rodar o seeder.', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });