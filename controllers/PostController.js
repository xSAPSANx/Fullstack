import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate({
			path: 'user',
			select: ['fullName', 'avatarUrl'],
		})

		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: 'After' }
		).then(doc => res.json(doc))
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Не удалось получить статьи в getOne',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		const userId = req.userId
		const post = await PostModel.findById(postId)

		if (!post) {
			return res.status(404).json({ message: 'Статья не найдена' })
		}
		if (post.user.toString() !== userId) {
			return res.status(403).json({ message: 'Нет доступа к удалению статьи' })
		}

		PostModel.findOneAndDelete(
			{ _id: postId },
			{
				if(err) {
					console.log(err)
					return res.status(500).json({
						message: 'Не удалось удалить статью',
					})
				},
			}
		).then(doc => {
			if (!doc) {
				return res.status(404).json({
					message: 'Статья не найдена',
				})
			} else
				res.json({
					success: true,
				})
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'Не удалось удалить статьи в delete',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id
		const userId = req.userId
		const post = await PostModel.findById(postId)

		if (!post) {
			return res.status(404).json({ message: 'Статья не найдена' })
		}
		if (post.user.toString() !== userId) {
			return res
				.status(403)
				.json({ message: 'Нет доступа к редактированию статьи' })
		}

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags,
				user: req.userId,
			}
		)
		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось отредактировать статью',
		})
	}
}
