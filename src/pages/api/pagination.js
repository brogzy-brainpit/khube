import { storefront } from "@/utils/queries";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      query,
      variables = {},
    } = req.body;

    const { data, errors } = await storefront(query, variables);

    if (errors) {
      return res.status(500).json({
        errors,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}