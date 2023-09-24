'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, ) {
        await queryInterface.bulkInsert("Users", [{
                username: "shendy",
                email: "shendy@gmail.com",
                password: "shendy123",
                role: "user",
                profile_image_url: "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695552914/rupfbhmp96bkdscy2x9g.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "galih",
                email: "galih@gmail.com",
                password: "galih123",
                role: "user",
                profile_image_url: "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695553065/ldktrzeo1oud4iidzx9f.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "pande",
                email: "pande@gmail.com",
                password: "pande123",
                role: "user",
                profile_image_url: "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695553165/z0vt6dzajs43bnvduehw.jpg",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, ) {
        await queryInterface.bulkDelete("Users", null, {});
    }
};