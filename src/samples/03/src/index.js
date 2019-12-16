import React, {Component} from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";

const node = document.getElementById("root");

class Post extends React.Component {
    render() {
        return React.createElement(
            "div",
            {
                className: "post"
            },
            React.createElement(
                "h2",
                {
                    className: "postAuthor",
                    id: this.props.id
                },
                this.props.user,
                React.createElement(
                    "span",
                    {
                        className: "postBody"
                    },
                    this.props.content
                ),
                this.props.children
            )
        );
    }
}

Post.propTypes = {
    user: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
};

class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.user + " : "}</h2>
                <span className="commentContent">{this.props.content}</span>
            </div>
        );
    }
}

Comment.propTypes = {
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired
};

class CreateComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            user: ""
        };
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleUserChange(event) {
        const val = event.target.value;
        this.setState(() => ({
            user: val
        }));
    }
    handleTextChange(event) {
        const val = event.target.value;
        this.setState({
            content: val
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.onCommentSubmit({
            user: this.state.user.trim(),
            content: this.state.content.trim()
        });

        this.setState(() => ({
            user: this.state.user.trim(),
            content: this.state.content.trim()
        }));
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="createComment">
                <input
                    value={this.state.user}
                    onChange ={this.handleUserChange}
                    placeholder="Your name"
                    type="text"
                 />
                 <input
                    value={this.state.content}
                    onChange={this.handleTextChange}
                    placeholder="Thoughts?"
                    type="text"
                 />
                 <button type="submit">Post</button>
            </form>
        );
    }
}
CreateComment.propTypes = {
    onCommentSubmit: PropTypes.func.isRequired,
    content: PropTypes.string
};


const data = {
    post: {
        id: 123,
        content:
            'What we hope ever to do with ease, we must first learn to do with diligence. -- Samuel Johnson',
        user: 'Mark Thomas',
    },
    comments: [
        {
            id: 0,
            user: 'David',
            content: 'such. win.',
        },
        {
            id: 1,
            user: 'Peter ',
            content: 'Who was Samuel Johnson?',
        },{
            id: 2,
            user: 'Mitchell',
            content: '@Peter get off Letters adn do your home work',
        },{
            id: 3,
            user: 'Peter',
            content: '@mitchell ok :P',
        },
    ]
}

class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: this.props.comments
        };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    handleCommentSubmit(comment) {
        const comments = this.state.comments;
        comment.id = Date.now();
        const newComments = comments.concat([comment]);
        this.setState({
            comments: newComments
        });
    }

    render() {
        return (
            <div className="commentBox">
                <Post
                    id={this.props.post.id}
                    content={this.props.post.content}
                    user={this.props.post.user}
                />
                {this.state.comments.map(function(comment) {
                    return (
                        <Comment key={comment.id} content={comment.content} user={comment.user}/>
                    );
                })}
                <CreateComment onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );

    }
}

render(
    <CommentBox
        comments={data.comments}
        post={data.post}
    />,
    node
);

