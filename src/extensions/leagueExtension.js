const listLeague = [
    { name: "Bronze", path: require("@/assets/images/rank/bronze-small.png") },
    { name: "Silver", path: require("@/assets/images/rank/silver-small.png") },
    { name: "Gold", path: require("@/assets/images/rank/gold-small.png") },
    { name: "Platinum", path: require("@/assets/images/rank/platinum-small.png") },
    { name: "Diamond", path: require("@/assets/images/rank/diamond-small.png") },
]
export const getLeagueInfo = (index) => {
    try {
        return listLeague[index]
    } catch (Exception) {
        return listLeague[0]
    }
}