import { Address } from "../../../DB/Models/index.js";

export const addAddress = async (req, res, next) => {
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    setAsDefault,
  } = req.body;

  const userId = req.authUser;

  const newAddress = new Address({
    userId,
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false,
  });

  if (newAddress.isDefault) {
    await Address.findOneAndUpdate(
      { userId, isDefault: true },
      { isDefault: false }
    );
  }

  const address = await newAddress.save();
  res.status(201).json({
    status: "success",
    message: "Address added successfully",
    address,
  });
};
