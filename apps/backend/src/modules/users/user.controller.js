import * as userService from "./user.service.js"

export async function getUsers(req, res) {
    const users = await userService.getUsers()
    res.status(200).json(users);
}

export async function getMyProfile(req, res) {
    const profile = await userService.getMyProfile(req.user.userId)
    res.status(200).json(profile)
}

export async function getAUser(req, res) {
    const user = await userService.getAUser(req.params.id)
    res.status(200).json(user)
}

export async function updateMyProfile(req, res) {
    const profile = await userService.updateMyProfile(req.user.userId, req.body)
    res.status(200).json(profile);
}

export async function deleteAUser(req, res) {
    await userService.deleteAUser(req.params.id)
    res.sendStatus(204);
}

export async function deleteMyProfile(req, res) {
    await userService.deleteMyProfile(req.user.userId)
    res.sendStatus(204);
}

export async function changePassword(req, res) {
    const profile = await userService.changePassword(req.user.userId, req.body.password)
    res.status(200).json(profile);
}

export async function changeUserRole(req, res) {
    const user = await userService.changeUserRole(req.params.id, req.body)
    res.status(200).json(user);
}