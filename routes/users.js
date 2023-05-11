import { Router } from "express";
import { users } from "../database.js";
import { User } from "../models/user.js";

const router = Router();

// GET all users
router.get("/", (request, response) => {
  return response.json({
    data: {
      users: users,
    },
  });
});

// GET a user by id
router.get("/:id", (request, response) => {
  const userId = request.params.id;
  const user = users.find((element) => element.id === Number(userId));

  if (user) {
    return response.status(200).json({
      data: {
        user: user,
      },
    });
  } else {
    return response.status(404).json({
      error: {
        code: 404,
        message: "User not found",
      },
    });
  }
});

// POST (add a new) user
router.post("/", (request, response) => {
  const userDetails = request.body;

  const requiredInfos = [
    "id",
    "name",
    "username",
    "email",
    "createdAt",
    "updatedAt",
  ];

  requiredInfos.forEach((info) => {
    if (!Boolean(userDetails[info])) {
      return response.status(401).json({
        error: {
          code: 401,
          message: `${info} property is required`,
        },
      });
    }
  });

  Object.keys(userDetails).forEach((key) => {
    if (!requiredInfos.includes(key)) {
      return response.status(401).json({
        error: {
          code: 401,
          message: `${key} property not allowed`,
        },
      });
    }
  });

  const user = new User(userDetails);
  user.save();

  return response.status(201).json({
    data: {
      code: 201,
      message: "User successfully added",
      user: user,
    },
  });
});

// PUT (update) existing user
router.put("/:id", (request, response) => {
  const id = request.params.id;
  const body = request.body;

  if (body.id) {
    return response.status(403).json({
      error: {
        code: 403,
        message: "You cannot update your id",
      },
    });
  }

  const acceptedProperties = ["name", "phone", "address"];

  for (const key in body) {
    if (!acceptedProperties.includes(key)) {
      return response.status(403).json({
        error: {
          code: 403,
          message:
            "Unsupported property. Please update only name, phone, and address",
        },
      });
    }
  }

  const user = users.find((element) => element.id === Number(id));

  if (!user) {
    return response.status(404).json({
      error: {
        code: 404,
        message: "User not found",
      },
    });
  }

  const updatedUser = { ...user, ...body };
  users[users.indexOf(user)] = updatedUser;

  return response.status(200).json({
    data: {
      code: 200,
      message: "User updated successfully",
      user: updatedUser,
    },
  });
});

// DELETE a user
router.delete("/:id", (request, response) => {
  const id = request.params.id;
  const user = users.find((element) => element.id === Number(id));

  if (!user) {
    return response.status(404).json({
      error: {
        success: false,
        code: 404,
        message: "User not found",
      },
    });
  }

  users.splice(users.indexOf(user), 1);

  return response.status(200).json({
    data: {
      success: true,
      message: "User deleted",
    },
  });
});

export const usersRouter = router;
