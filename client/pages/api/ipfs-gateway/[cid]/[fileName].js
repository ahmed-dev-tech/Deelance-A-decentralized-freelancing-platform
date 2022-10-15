import axios from "axios";

export default async function handler(req, res) {
  const { cid, fileName } = req.query;
  try {
    const response = await axios.get(
      `https://${cid}.ipfs.ipfs-gateway.cloud/${fileName}`
    );
    res.status(200).json({ data: response.data, status: response.status });
  } catch (e) {
    res.send({ message: "Something went wrong, please try again" });
  }
}
