"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "test",
        email: "test@gmail.com",
        password:
          "$2b$10$UDT/Yz0mi6TYdBOjnTrgKeCo5z6ErbvSFNXzhX2LHL2HG3dQOo3k2",
        role: "user",
        profile_image_url:
          "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695552914/rupfbhmp96bkdscy2x9g.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "galih",
        email: "galih@gmail.com",
        password:
          "$2b$10$036KeR9TsLjawYJMGJmk7u4T3LeAeOaJ7TJgZWqVqFLN/soLmRZVK",
        role: "user",
        profile_image_url:
          "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695553065/ldktrzeo1oud4iidzx9f.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "pande",
        email: "pande@gmail.com",
        password:
          "$2b$10$MQHfHIbfiHN68yvNJkrSk.AZEfKG9oRWTgtgnFvVsDTdbrkIBAWmG",
        role: "user",
        profile_image_url:
          "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695553165/z0vt6dzajs43bnvduehw.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
