export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err) {
      return res.status(400).json({
        error: "Please ensure username is atleast 1 character long and password is atleast 8 characters long!"
      })
    }
  }
}
