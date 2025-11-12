import React, {StrictMode} from 'react'

import RegistrationForm from '../../forms/RegistrationForm'
import ErrorBoundary from '../../libs/ErrorBoundary'

export default function RegisterApp() {
    return (
        <StrictMode>
            <ErrorBoundary>
                <RegistrationForm/>
            </ErrorBoundary>
        </StrictMode>
    )
}