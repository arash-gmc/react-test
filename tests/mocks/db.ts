import {factory , manyOf, oneOf, primaryKey} from '@mswjs/data'
import {faker} from '@faker-js/faker'

export const db = factory({
    products:{
        id: primaryKey(faker.number.int),
        name: faker.commerce.productName,
        price: ()=>faker.number.int({min:1,max:100}),
        categoryId : ()=> faker.number.int(),
        category: oneOf('categories')
    },
    categories:{
        id:primaryKey(faker.number.int),
        name: faker.commerce.product,
        products: manyOf('products')
    }
})

export const  getProductsByCategory = (categoryId:number)=>
db.products.findMany({
    where: { categoryId: { equals: categoryId } },
  });
