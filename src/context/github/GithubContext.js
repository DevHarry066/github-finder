import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({ children }) => {
    const initialState = {
        users: [],
        user: {},
        loading: false,
    }

    const [state, dispatch] = useReducer(githubReducer, initialState);

    // Get search User
    const searchUsers = async (text) => {
        setLoading();
        const params = new URLSearchParams({
            q: text
        });
        const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        })

        const { items } = await response.json();

        dispatch({
            type: 'GET_USERS',
            payload: items,
        });
    }

    //Get Single User
    const getUser = async (username) => {
        setLoading();
        const response = await fetch(`${GITHUB_URL}/users/${username}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (response.statusCode === 404) {
            window.location = '/notfound';
        } else {

            const userData = await response.json();

            dispatch({
                type: 'GET_USER',
                payload: userData,
            });
        }

    }


    const setLoading = () => dispatch({
        type: 'SET_LOADING'
    });

    //Clear user from State
    const clearUsers = () => dispatch({ type: 'CLEAR_USERS' });

    return (
        <GithubContext.Provider value={{
            users: state.users,
            user: state.user,
            loading: state.loading,
            searchUsers,
            clearUsers,
            getUser,
        }}>
            {children}
        </GithubContext.Provider>
    )
}

export default GithubContext;