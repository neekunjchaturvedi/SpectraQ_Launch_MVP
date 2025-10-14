import Email from "../models/schema.js";
const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const info = new Email({ email });
    if (!email) {
      return res.status(400).json({ message: "Email Required" });
    } else {
      await info.save();
      return res.status(200).json({
        success: true,
        message: "Email saved successfully",
        data: info,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendEmail };
