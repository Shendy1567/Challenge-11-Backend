'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Games", [
      {
        title: "Gunting Batu Kertas",
        description: "Enjoy Gunting Batu Kertas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Kertas Gunting Batu",
        description: "Enjoy Kertas Gunting Batu",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Games", null, {});
  }
};
