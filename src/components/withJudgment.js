import React from 'react'

class MatchedPreferenceHints extends React.Component {

    render(){
        const {attributes} = this.props
        return(
            <ul>
            {
              attributes.map( attr => {
                return (<li key={attr}>{attr}</li>)
              })
            }
            </ul>
        )
    }
}

const withJudgement = (WrappedComponent) => {
    class WithJudgement extends React.Component {
        render() {
            const { reasons, showMatches = true, ...props } = this.props
            return(
                <WrappedComponent {...props}>
                    { (showMatches && reasons && <MatchedPreferenceHints attributes={reasons} />) || null }
                </WrappedComponent>
            )
        }
    }
    return WithJudgement
}

export default withJudgement