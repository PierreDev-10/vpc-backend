'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('registrations', [
      {
        fullName: 'John Doe',
        dob: '1990-01-01',
        age: '34',
        mobileNumber: '0551234567',
        occupation: 'Software Developer',
        gender: 'Male',
        maritalStatus: 'Single',
        email: 'john.doe@example.com',
        resAddress: '123 Main Street',
        houseNumber: 'GA-123-4567',
        landmark: 'Close to Mall',
        postalAddress: 'P.O. Box 123',
        previousChurchName: 'Grace Chapel',
        talent: 'Singing',
        position: 'Youth Leader',
        denomination: 'Presbyterian',
        confirmationDate: '2005-06-12',
        confirmationPlace: 'Accra',
        baptismDate: '2000-04-20',
        baptismPlace: 'Tema',
        reasonNoMembershipCard: 'Lost card',
        isConfirmed: true,
        isBaptized: false,
        hasJoinedCongregationBefore: true,
        hasMembershipCard: false,
        hasMembershipCardFromPreviousChurch: true,
        isCommunicant: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('registrations', null, {});
  },
};