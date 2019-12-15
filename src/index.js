import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';
//import * as serviceWorker from './serviceWorker';


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();


function Square(props) {

	const className = props.crossed ? 'square-crossed' : 'square';
	return (
		<button className={className}
				onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {

	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				crossed={this.props.crossed[i]}
				onClick={() => this.props.onClick(i)}
		/>);
	}


	render() {

		return (

			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
			);
	}


}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				moves: [],
			}],
			stepNumber: 0,
			xIsNext: true,
			desc: true
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const moves = current.moves.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X': 'O';
		moves.push(i);
		this.setState({
			history: history.concat([{
				squares: squares,
				moves: moves,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			moves: moves,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2 ) === 0,
		});
	}

	resort() {
		this.setState({
			desc: !this.state.desc
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		let crossed = Array(9).fill(false);
		if(winner) {
			const winnerLine = getWinnerLine(current.squares);
			if(winnerLine) {
				winnerLine.forEach(e => crossed[e] = true);
			}
		}

		let moves = history.map((step, move) => {
			const pos = step.moves[step.moves.length - 1];
			// debugger;
			const desc = move ?
				'Go to move #' + move + ' Position:(' + Math.floor((pos/3))+ ',' + (pos%3) + ')' :
				'Go to game start';
			if(move < this.state.stepNumber) {
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}>{desc}</button>
					</li>
				);
			} else {
				return (
					<li key={move}>
						<button style={{'fontWeight': 'bold'}} onClick={() => this.jumpTo(move)}>{desc}</button>
					</li>
				);
			}
		});

		if(!this.state.desc) {
			moves = moves.reverse()
		}

		let status;
		if (winner) {
			status = 'Winnder: ' + winner;
		} else {
			if(this.state.stepNumber >= 9) {
				status = 'Tie';
			} else {

				status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
			}

		}

		const sort = this.state.desc? 'DESC' : 'INC';

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						crossed={crossed}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<button
						onClick={() => this.resort()}>
						{sort}
					</button>

					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++)  {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

function getWinnerLine(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++)  {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return lines[i];
		}
	}
	return null;
}



//render dom
ReactDOM.render(<Game />, document.getElementById('root'));


	
