const CustomerProfile = require("../model/CustomerProfile.model");
const axiosInstance = require("../axios/axios.user");
const dotenv = require("dotenv");

dotenv.config();

const createCustomerProfileData = async (req, res) => {
  try {
    const { user } = req.user;
    if (!user) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // console.log("User service id", user); // debug log

    //todo: (Optional) Fetch user data from user service
    // const userResponse = await axiosInstance.get(`/userId/${user}`, {
    //   headers: {
    //     Authorization: req.headers.authorization,
    //   },
    // });

    // if (!userResponse) {
    //   return res
    //     .status(404)
    //     .json({ message: "Unauthorized, user service data not found" });
    // }

    // const userData = userResponse.data;
    // console.log("User service data", userData); // debug log

    // Get profile data from body
    const { fullName, email, phoneNumber, address } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !address) {
      return res.status(400).json({
        message:
          "All fields (fullName, email, phoneNumber, address) are required",
      });
    }

    // Check if profile already exists for user
    const existingProfile = await CustomerProfile.findOne({ userId: user });
    if (existingProfile) {
      return res.status(400).json({
        message: "Customer Profile already exists for this user",
      });
    }

    const newCustomerProfile = new CustomerProfile({
      userId: user,
      fullName,
      email,
      phoneNumber,
      address,
    });

    const saveProfile = await newCustomerProfile.save();

    // Combine profile data with user service data
    const profileWithUser = {
      ...saveProfile.toObject(),
      userId: user,
    };

    return res.status(201).json({
      message: "Customer Profile Created Successfully",
      profile: profileWithUser,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error while creating profile data",
      error: error.message,
    });
  }
};

// Get all customer profile data
const getAllCustomerProfileData = async (req, res) => {
  try {
    const customerProfiles = await CustomerProfile.find();
    if (customerProfiles.length === 0) {
      return res.status(404).json({ message: "No customer profiles found" });
    }
    res
      .status(200)
      .json({ message: "All Customer Profile Data", customerProfiles });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update customer profile data
const updateCustomerProfileData = async (req, res) => {
  try {
    // only user can update his profile data

    const { user } = req.user;
    const id = req.params.id;

    // Validate required fields
    const { fullName, email, phoneNumber, address } = req.body;
    if (!fullName || !email || !phoneNumber || !address) {
      return res.status(400).json({
        message:
          "All fields (fullName, email, phoneNumber, address) are required",
      });
    }

    // Check if profile exists for user
    const existingProfile = await CustomerProfile.findOne({ userId: user });
    if (!existingProfile) {
      return res.status(404).json({
        message: "Customer Profile not found for this user",
      });
    }

    // Update the profile data
    const updatedProfile = await CustomerProfile.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phoneNumber,
        address,
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Customer Profile Updated Successfully",
      updatedProfile,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error while updating profile data",
      error: error.message,
    });
  }
};

// delete customer profile data
const deleteCustomerProfileData = async (req, res) => {
  try {
    // only admin and employee can delete customer profile data
    const { user } = req.user;
    const id = req.params.id;

    // Check if profile exists for user
    const existingProfile = await CustomerProfile.findOne({ userId: user });
    if (!existingProfile) {
      return res.status(404).json({
        message: "Customer Profile not found for this user",
      });
    }

    // Delete the profile data
    const deletedProfile = await CustomerProfile.findByIdAndDelete(id);

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Customer Profile Deleted Successfully",
      deletedProfile,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error while deleting profile data",
      error: error.message,
    });
  }
};

module.exports = {
  createCustomerProfileData,
  getAllCustomerProfileData,
  updateCustomerProfileData,
  deleteCustomerProfileData,
};
