const express = require("express");
const router = express.Router();

const { body, param, query, validationResult } = require("express-validator");
const { formatTime } = require("../services/format");

// GET /entrsut/pets
router.get(
  "/pets",
  [
    query("limit").isNumeric().notEmpty(),
    query("offset").isNumeric().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const { limit, offset } = req.query;
    const {
      error,
      result,
    } = await req.container.entrustService.listEntrustablePets(limit, offset);
    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// GET /entrsut/info
router.get("/info", async (req, res, next) => {
  const { error, result } = await req.container.entrustService.getInfo();

  if (error) next(new Error(error));
  else res.json({ result });
});

// GET /entrust (list entrust application)
router.get(
  "/",
  [
    query("limit").isNumeric().notEmpty(),
    query("offset").isNumeric().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const { limit, offset } = req.query;
    const { error, result } = await req.container.entrustService.list(
      limit,
      offset
    );

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// GET /entrust/:eid
router.get(
  "/:eid",
  [param("eid").isNumeric().notEmpty()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const eid = req.param.eid;
    const { error, result } = await req.container.entrustService.get(eid);

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// POST /entrust
router.post(
  "/",
  [
    body("text").isString(),
    body("startDate").isDate(),
    body("endDate").isDate(),
    body("toypayment").isNumeric(),
    body("cityId").isNumeric(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const createdDate = formatTime(new Date());
    const { text, startDate, endDate, toypayment, cityId } = req.body;

    const { error, result } = await req.container.entrustService.create({
      text,
      startDate,
      endDate,
      toypayment,
      cityId,
      createdDate,
      uid,
    });

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// PUT /entrust/:eid
router.put(
  "/:eid",
  [
    param("eid").isNumeric(),
    body("text").isString(),
    body("startDate").isDate(),
    body("endDate").isDate(),
    body("toypayment").isNumeric(),
    body("cityId").isNumeric(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const eid = req.params.eid;
    const { text, startDate, endDate, toypayment, cityId } = req.body;

    const {
      error: e1,
      result: entrust,
    } = await req.container.entrustService.get(eid);

    if (e1) return next(new Error(e1));
    else if (entrust.UID != uid)
      return next(new Error("Authentication Error!"));

    const { error, result } = await req.container.entrustService.update(eid, {
      text,
      startDate,
      endDate,
      toypayment,
      cityId,
    });

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// DELETE /entrust/:eid
router.delete("/:eid", [param("eid").isNumeric()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const eid = req.param.eid;

  const { error: e1, result: entrust } = await req.container.entrustService.get(
    eid
  );
  if (e1) return next(new Error(e1));
  else if (entrust.UID != uid) return next(new Error("Authentication Error!"));

  const { error, result } = await req.container.entrustService.delete(eid);
  if (error) next(new Error(error));
  else res.json({ result });
});

module.exports = router;