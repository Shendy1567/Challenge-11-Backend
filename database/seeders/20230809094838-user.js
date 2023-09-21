'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "shendy",
        email: "shendy@gmail.com",
        password: "shendy123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "galih",
        email: "galih@gmail.com",
        password: "galih123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "pande",
        email: "pande@gmail.com",
        password: "pande123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
