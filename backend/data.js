import bcrypt from 'bcryptjs';

const data = {

    users: [
      {
        name: 'admin',
        email: 'vinagapetru11@gmail.com',
        password: bcrypt.hashSync('admin'),
        isAdmin: true,
      },
      {
        name: 'user',
        email: 'vinagapetru11@mail.ru',
        password: bcrypt.hashSync('user'),
        isAdmin: false,
      }
    ],
    products: [
        {
          name: 'Nike Slim shirt',
          slug: 'nike-slim-shirt',
          category: 'Shirts',
          image: '/images/img1.jpg', // 679px × 829px
          price: 120,
          countInStock: 0,
          brand: 'Nike',
          rating: 5,
          numReviews: 10,
          description: 'high quality shirt',
        },
        {
          name: 'Adidas Fit Shirt',
          slug: 'adidas-fit-shirt',
          category: 'Shirts',
          image: '/images/img2.jpg',
          price: 250,
          countInStock: 2,
          brand: 'Adidas',
          rating: 4.0,
          numReviews: 10,
          description: 'high quality product',
        },
        {
          name: 'Nike Slim Pant',
          slug: 'nike-slim-pant',
          category: 'Pants',
          image: '/images/img3.jpg',
          price: 25,
          countInStock: 15,
          brand: 'Nike',
          rating: 4.5,
          numReviews: 14,
          description: 'high quality product',
        },
        {
          name: 'Adidas Fit Pant',
          slug: 'adidas-fit-pant',
          category: 'Pants',
          image: '/images/img4.jpg',
          price: 65,
          countInStock: 5,
          brand: 'Puma',
          rating: 4.5,
          numReviews: 10,
          description: 'high quality product',
        },
      ],
}
export default data;
