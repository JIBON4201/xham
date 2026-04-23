import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const ICONS = ["Sparkles", "TrendingUp", "Film", "Flame", "Crown", "Zap"]

const cards = [
  { sceneId: "scene-02", title: "Cosmic Nebula", tag: "Featured Preview", image: "/ai-gallery/scene-02.png", duration: "3:18", views: "22.8K", icon: "TrendingUp", category: "all", order: 2 },
  { sceneId: "scene-03", title: "Deep Ocean Dreams", tag: "AI Preview", image: "/ai-gallery/scene-03.png", duration: "1:52", views: "9.7K", icon: "Sparkles", category: "all", order: 3 },
  { sceneId: "scene-04", title: "Liquid Chrome", tag: "Trending Visual", image: "/ai-gallery/scene-04.png", duration: "2:07", views: "18.3K", icon: "TrendingUp", category: "all", order: 4 },
  { sceneId: "scene-06", title: "Holographic Fractals", tag: "Featured Preview", image: "/ai-gallery/scene-06.png", duration: "2:45", views: "16.9K", icon: "Film", category: "all", order: 6 },
  { sceneId: "scene-07", title: "Bioluminescent Caves", tag: "AI Preview", image: "/ai-gallery/scene-07.png", duration: "3:42", views: "27.1K", icon: "Sparkles", category: "nature", order: 7 },
  { sceneId: "scene-08", title: "Cyberpunk Rain", tag: "Trending Visual", image: "/ai-gallery/scene-08.png", duration: "2:58", views: "35.6K", icon: "Flame", category: "scifi", order: 8 },
  { sceneId: "scene-09", title: "Volcanic Fury", tag: "Featured Preview", image: "/ai-gallery/scene-09.png", duration: "4:22", views: "41.3K", icon: "Crown", category: "nature", order: 9 },
  { sceneId: "scene-10", title: "Abyssal Glow", tag: "AI Preview", image: "/ai-gallery/scene-10.png", duration: "3:15", views: "19.8K", icon: "Sparkles", category: "nature", order: 10 },
  { sceneId: "scene-11", title: "Crystal Desert", tag: "Trending Visual", image: "/ai-gallery/scene-11.png", duration: "5:03", views: "28.4K", icon: "TrendingUp", category: "scifi", order: 11 },
  { sceneId: "scene-12", title: "Enchanted Ruins", tag: "Featured Preview", image: "/ai-gallery/scene-12.png", duration: "3:37", views: "33.2K", icon: "Crown", category: "fantasy", order: 12 },
  { sceneId: "scene-13", title: "Crimson Dynamics", tag: "AI Preview", image: "/ai-gallery/scene-13.png", duration: "2:19", views: "15.6K", icon: "Sparkles", category: "abstract", order: 13 },
  { sceneId: "scene-14", title: "Polar Aurora", tag: "Trending Visual", image: "/ai-gallery/scene-14.png", duration: "4:55", views: "44.7K", icon: "Flame", category: "nature", order: 14 },
  { sceneId: "scene-15", title: "Clockwork Metropolis", tag: "Featured Preview", image: "/ai-gallery/scene-15.png", duration: "3:28", views: "21.9K", icon: "Film", category: "scifi", order: 15 },
  { sceneId: "scene-16", title: "Fractal Dimensions", tag: "AI Preview", image: "/ai-gallery/scene-16.png", duration: "2:44", views: "17.5K", icon: "Sparkles", category: "abstract", order: 16 },
  { sceneId: "scene-17", title: "Arcane Library", tag: "Featured Preview", image: "/ai-gallery/scene-17.png", duration: "3:51", views: "38.1K", icon: "Crown", category: "fantasy", order: 17 },
  { sceneId: "scene-18", title: "Galactic Collision", tag: "Trending Visual", image: "/ai-gallery/scene-18.png", duration: "5:17", views: "52.3K", icon: "Flame", category: "scifi", order: 18 },
  { sceneId: "scene-19", title: "Derelict Station", tag: "AI Preview", image: "/ai-gallery/scene-19.png", duration: "2:33", views: "23.7K", icon: "Sparkles", category: "scifi", order: 19 },
  { sceneId: "scene-20", title: "Neon Velocity", tag: "Trending Visual", image: "/ai-gallery/scene-20.png", duration: "1:48", views: "29.4K", icon: "Zap", category: "abstract", order: 20 },
  { sceneId: "scene-21", title: "World Tree", tag: "Featured Preview", image: "/ai-gallery/scene-21.png", duration: "4:09", views: "36.8K", icon: "Crown", category: "fantasy", order: 21 },
  { sceneId: "scene-22", title: "Chrome Reflections", tag: "AI Preview", image: "/ai-gallery/scene-22.png", duration: "2:56", views: "20.2K", icon: "Sparkles", category: "abstract", order: 22 },
  { sceneId: "scene-23", title: "Amethyst Depths", tag: "Trending Visual", image: "/ai-gallery/scene-23.png", duration: "3:33", views: "25.9K", icon: "TrendingUp", category: "nature", order: 23 },
  { sceneId: "scene-24", title: "Twilight Megacity", tag: "Featured Preview", image: "/ai-gallery/scene-24.png", duration: "4:41", views: "47.6K", icon: "Flame", category: "scifi", order: 24 },
  { sceneId: "scene-25", title: "Psychedelic Drift", tag: "AI Preview", image: "/ai-gallery/scene-25.png", duration: "2:12", views: "18.7K", icon: "Sparkles", category: "abstract", order: 25 },
  { sceneId: "scene-26", title: "Moonlit Garden", tag: "Featured Preview", image: "/ai-gallery/scene-26.png", duration: "3:26", views: "32.4K", icon: "Crown", category: "nature", order: 26 },
]

async function main() {
  console.log('Seeding gallery cards...')
  
  for (const card of cards) {
    await db.galleryCard.upsert({
      where: { sceneId: card.sceneId },
      update: card,
      create: card,
    })
  }
  
  const count = await db.galleryCard.count()
  console.log(`Done! ${count} gallery cards seeded.`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
