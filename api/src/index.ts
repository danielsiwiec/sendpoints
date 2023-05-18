import {Request, onRequest} from "firebase-functions/v2/https";
import {Response} from "express";
import * as logger from "firebase-functions/logger";
import Ajv from "ajv";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import {initializeGtag, gtag} from "gtag-ga";

initializeApp();
initializeGtag("G-167DG9RQRQ");

const COLLECTION_NAME = "locations";

const allowedOrigins = ["http://localhost:3000", "https://www.sendpoints.us", "https://web.sendpoints.us", "https://sendpoints.us"];

const firestore = getFirestore();

export const locations = onRequest((req: Request, res: Response) => {
  const origin = req.get("origin");
  if (origin && allowedOrigins.indexOf(origin) > -1) {
    res.set("Access-Control-Allow-Origin", req.get("origin"));
  }

  if (req.method === "POST") {
    handlePost(req, res);
  } else if (req.method === "GET") {
    handleGet(req, res);
  } else if (req.method === "OPTIONS") {
    handleOptions(req, res);
  } else {
    res.status(405).send({error: `Method ${req.method} not supported`});
  }
});

const validator = () => {
  const ajv = new Ajv();

  const schema = {
    type: "object",
    properties: {
      id: {type: "string"},
      name: {type: "string"},
      geo: {
        type: "object",
        properties: {
          lat: {type: "number"},
          long: {type: "number"},
        },
        required: ["lat", "long"],
      },
    },
    required: ["name", "geo", "id"],
    additionalProperties: false,
  };

  return ajv.compile(schema);
};

const hashGen = () => {
  const random = Math.floor(Math.random() * 10000);
  return String("0000" + random).slice(-4);
};

const addHours = (date: Date, h: number) => {
  return new Date(date.valueOf() + 60 * 60 * 1000 * h);
};

const handlePost = async (req: Request, res: Response) => {
  track("save", req.query.source as string);
  const data = req.body || {};

  const validate = validator();

  if (!validate(req.body)) {
    logger.error(validate.errors);
    res.sendStatus(400);
    return;
  }

  data.ttl = addHours(new Date(), 5);
  let id = hashGen();
  id = data.id;
  delete data.id;
  try {
    await firestore.collection(COLLECTION_NAME).doc(id).set(data);
    logger.info("stored new doc #", data.id);
    return res.status(200).send({hash: id});
  } catch (err) {
    logger.error(err);
    return res.status(503).send({
      error: "unable to store",
      err,
    });
  }
};

const handleGet = async (req: Request, res: Response) => {
  track("get", req.query.source as string);
  const id = req.path.split("/")[1];
  const doc = await firestore.collection(COLLECTION_NAME).doc(id).get();

  if (doc.exists) {
    const data = doc.data();
    if (data) {
      delete data.ttl;
      res.status(200).send(data);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
};

const handleOptions = async (_req: Request, res: Response) => {
  res.set("Access-Control-Allow-Methods", "GET,POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  res.status(204).send("");
};

const track = (event: string, source: string) => {
  if (source !== "newrelic") {
    gtag("event", event);
  }
};
