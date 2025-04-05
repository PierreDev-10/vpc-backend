'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: Sequelize.STRING,
      dob: Sequelize.STRING,
      age: Sequelize.STRING,
      mobileNumber: Sequelize.STRING,
      occupation: Sequelize.STRING,
      gender: Sequelize.STRING,
      maritalStatus: Sequelize.STRING,
      email: Sequelize.STRING,
      resAddress: Sequelize.STRING,
      houseNumber: Sequelize.STRING,
      landmark: Sequelize.STRING,
      postalAddress: Sequelize.STRING,
      previousChurchName: Sequelize.STRING,
      talent: Sequelize.STRING,
      position: Sequelize.STRING,
      denomination: Sequelize.STRING,
      confirmationDate: Sequelize.STRING,
      confirmationPlace: Sequelize.STRING,
      baptismDate: Sequelize.STRING,
      baptismPlace: Sequelize.STRING,
      reasonNoMembershipCard: Sequelize.STRING,
      isConfirmed: Sequelize.BOOLEAN,
      isBaptized: Sequelize.BOOLEAN,
      hasJoinedCongregationBefore: Sequelize.BOOLEAN,
      hasMembershipCard: Sequelize.BOOLEAN,
      hasMembershipCardFromPreviousChurch: Sequelize.BOOLEAN,
      isCommunicant: Sequelize.BOOLEAN,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('registrations');
  }
};