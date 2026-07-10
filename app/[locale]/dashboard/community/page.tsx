'use client'

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-yellow-400">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join the MarktBit community — discuss signals, share strategies, and connect with traders.</p>
      </div>

      {/* Community Channels */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="https://t.me/marktbit"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 hover:bg-yellow-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">💬</span>
            <div>
              <h3 className="font-semibold text-yellow-400 group-hover:underline">Telegram Group</h3>
              <p className="text-sm text-muted-foreground">Real-time signal discussions</p>
            </div>
          </div>
        </a>

        <a
          href="https://discord.gg/marktbit"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 hover:bg-yellow-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h3 className="font-semibold text-yellow-400 group-hover:underline">Discord Server</h3>
              <p className="text-sm text-muted-foreground">Voice chat & deep dives</p>
            </div>
          </div>
        </a>

        <a
          href="https://twitter.com/marktbit"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 hover:bg-yellow-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐦</span>
            <div>
              <h3 className="font-semibold text-yellow-400 group-hover:underline">Twitter / X</h3>
              <p className="text-sm text-muted-foreground">Market updates & news</p>
            </div>
          </div>
        </a>

        <a
          href="https://reddit.com/r/marktbit"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 hover:bg-yellow-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h3 className="font-semibold text-yellow-400 group-hover:underline">Reddit</h3>
              <p className="text-sm text-muted-foreground">Long-form analysis & AMA</p>
            </div>
          </div>
        </a>

        <a
          href="https://youtube.com/@marktbit"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 hover:bg-yellow-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">📺</span>
            <div>
              <h3 className="font-semibold text-yellow-400 group-hover:underline">YouTube</h3>
              <p className="text-sm text-muted-foreground">Tutorials & market reviews</p>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/marktbit"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 hover:bg-yellow-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className="font-semibold text-yellow-400 group-hover:underline">GitHub</h3>
              <p className="text-sm text-muted-foreground">Open source & issues</p>
            </div>
          </div>
        </a>
      </div>

      {/* Leaderboard Preview */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-yellow-400">Top Contributors</h2>
        <div className="space-y-2">
          {[
            { rank: 1, name: 'CryptoSage', points: 12450, badges: 8 },
            { rank: 2, name: 'IDXHunter', points: 9820, badges: 6 },
            { rank: 3, name: 'DiamondHands', points: 8760, badges: 5 },
            { rank: 4, name: 'MoonShot', points: 7340, badges: 4 },
            { rank: 5, name: 'ValueInvestor', points: 6210, badges: 4 },
          ].map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  user.rank === 1 ? 'bg-yellow-500 text-black' :
                  user.rank === 2 ? 'bg-gray-400 text-black' :
                  user.rank === 3 ? 'bg-orange-600 text-white' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {user.rank}
                </span>
                <span className="font-semibold text-yellow-400">{user.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{user.points.toLocaleString()} pts</span>
                <span>{user.badges} 🏅</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
