const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function deleteUserById(req, res) {
  try {
    const userId = req.params.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.send(`User with ID ${userId} deleted`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting user');
  }
}

module.exports = deleteUserById