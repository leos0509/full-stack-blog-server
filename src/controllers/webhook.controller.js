import User from "../models/user.model.js";
import { Webhook } from "svix";

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Clerk Webhook Secret required!" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  const payload = req.body;
  const headers = req.headers;

  console.log(payload);

  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return void res.status(400).json({
      success: false,
      message: 'Error: Missing svix headers',
    })
  }

  let evt;
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.log('Error: Could not verify webhook:', err.message)
    return void res.status(400).json({
      success: false,
      message: err.message,
    })
  }

  if (evt.type === "user.created") {
    const newUser = new User({
      clerkUserId: evt.data.id,
      username: evt.data.username,
      email: evt.data.email_addresses[0].email_address,
      img: evt.data.profile_imgage_url,
    });

    await newUser.save();
  }

  return res.status(200).json({ message: "Webhook received" });
};
