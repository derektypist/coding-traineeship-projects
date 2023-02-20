const team = {
    _players: [{
        firstName: 'Michael',
        lastName: 'Cheek',
        age: 42
    }, {
        firstName: 'Jonathan',
        lastName: 'Edwards',
        age: 38
    }, {
        firstName: 'Zaphod',
        lastName: 'Hayes',
        age: 35
    }],
    _games: [{
        opponent: 'Ravens',
        teamPoints: 51,
        opponentPoints: 40
    }, {
        opponent: 'Warriors',
        teamPoints: 48,
        opponentPoints: 53
    }, {
        opponent: 'Hawkers',
        teamPoints: 53,
        opponentPoints: 42
    }],

    get players() {
        return this._players;
    },

    get games() {
        return this._games;
    },

    addPlayer(newFirstName, newLastName, newAge) {
        let player = {
            firstName: newFirstName,
            lastName: newLastName,
            age: newAge
        };
        this.players.push(player);
    },

    addGame(newOpponent, newTeamPoints, newOpponentPoints) {
        let game = {
            opponent: newOpponent,
            teamPoints: newTeamPoints,
            opponentPoints: newOpponentPoints
        };
        this.games.push(game);
    }
};

// Add Player
team.addPlayer('Bugs', 'Bunny', 76);
console.log(team.players);

// Add Game
team.addGame('Titans', 100, 98);
console.log(team.games);