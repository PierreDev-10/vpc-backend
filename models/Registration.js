'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    static associate(models) {
      // define association here if needed later
    }
  }

  Registration.init({
    fullName: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    age: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    occupation: DataTypes.STRING,
    gender: DataTypes.STRING,
    maritalStatus: DataTypes.STRING,
    email: {
       type: DataTypes.STRING,
       unique: true, // ✅ Now correctly placed inside init
    },
    resAddress: DataTypes.STRING,
    houseNumber: DataTypes.STRING,
    landmark: DataTypes.STRING,
    postalAddress: DataTypes.STRING,
    previousChurchName: DataTypes.STRING,
    talent: DataTypes.STRING,
    position: DataTypes.STRING,
    denomination: DataTypes.STRING,
    confirmationDate: DataTypes.DATEONLY,
    confirmationPlace: DataTypes.STRING,
    baptismDate: DataTypes.DATEONLY,
    baptismPlace: DataTypes.STRING,
    reasonNoMembershipCard: DataTypes.STRING,
    isConfirmed: DataTypes.BOOLEAN,
    isBaptized: DataTypes.BOOLEAN,
    hasJoinedCongregationBefore: DataTypes.BOOLEAN,
    hasMembershipCard: DataTypes.BOOLEAN,
    hasMembershipCardFromPreviousChurch: DataTypes.BOOLEAN,
    isCommunicant: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Registration',
    tableName: 'registrations'
    });
  return Registration;
};