import React, {Component} from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        let local = true;
        this.base_url = 'http://localhost:8000/';
        this.state = {
            display_form: '',
            logged_in: localStorage.getItem('token') ? local : !local,
            username: ''
        };
    }

    componentDidMount() {
        if (this.state.logged_in) {
            fetch(`${this.base_url}core/current_user/`, {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                },
            })
                .then(res => res.json())
                .then(json => {
                    this.setState({username: json.username});
                });
        }
    }

    handle_login = (e, data) => {
        e.preventDefault();
        fetch(`${this.base_url}api-token-auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: '',
                    username: json.username
                });
            });
    };

    handle_signup = (e, data) => {
        e.preventDefault();
        fetch(`${this.base_url}core/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: '',
                    username: json.username
                });
            });
    };

    handle_logout = () => {
        localStorage.removeItem('token');
        this.setState({logged_in: false, username: ''})
    };

    display_form = form => {
        this.setState({
            displayed_form: form
        });
    };

    render() {
        let form;
        switch (this.state.displayed_form) {
            case 'login':
                form = <LoginForm handle_login={this.handle_login}/>
                break;
            case 'signup':
                form = <SignupForm handle_signup={this.handle_signup}/>
                break;
            default:
                form = null;
        }
        return (
            <div className="App">
                <Nav
                    logged_in={this.state.logged_in}
                    display_form={this.display_form}
                    handle_logout={this.handle_logout}
                />
                {form}
                <h3>
                    {
                        this.state.logged_in
                            ? `Hola ${this.state.username}`
                            : `Por favor Iniciar Sesion`
                    }
                </h3>
            </div>
        );
    }
}

export default App;
