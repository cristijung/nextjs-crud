import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { alertService, AlertType } from 'services';

export { Alert };

Alert.propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

Alert.defaultProps = {
    id: 'default-alert',
    fade: true
};

function Alert({ id, fade }) {
    const router = useRouter();
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // subscrever novas notificações de alerta
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {
                // clear alerts when an empty alert is received
                if (!alert.message) {
                    setAlerts(alerts => {
                        // filtrar alertas sem o sinalizador 'keepAfterRouteChange'
                        const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);

                        //remova o sinalizador 'keepAfterRouteChange' no resto
                        filteredAlerts.forEach(x => delete x.keepAfterRouteChange);
                        return filteredAlerts;
                    });
                } else {
                    // alerta do Array
                    setAlerts(alerts => ([...alerts, alert]));

                    // alerta de fechamento automático, se necessário
                    if (alert.autoClose) {
                        setTimeout(() => removeAlert(alert), 3000);
                    }
                }
            });
        

        //alertas de remoção na mudança de local
        const onRouteChange = () => alertService.clear(id);
        router.events.on('routeChangeStart', onRouteChange);

        //função de limpeza que é executada quando o componente é desmontado
        return () => {
            //cancelar a inscrição para evitar alteração na performance
            subscription.unsubscribe();
            router.events.off('routeChangeStart', onRouteChange);
        };
    }, []);

    function removeAlert(alert) {
        if (fade) {
            // alerta de fade
            const alertWithFade = { ...alert, fade: true };
            setAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // Remover alerta de fade
            setTimeout(() => {
                setAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 250);
        } else {
            // remover o alerta
            setAlerts(alerts => alerts.filter(x => x !== alert));
        }
    }

    function cssClasses(alert) {
        if (!alert) return;

        const classes = ['alert', 'alert-dismissable'];
                
        const alertTypeClass = {
            [AlertType.Success]: 'alert-success',
            [AlertType.Error]: 'alert-danger',
            [AlertType.Info]: 'alert-info',
            [AlertType.Warning]: 'alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    if (!alerts.length) return null;

    return (
        <div className="container">
            <div className="m-3">
                {alerts.map((alert, index) =>
                    <div key={index} className={cssClasses(alert)}>
                        <a className="close" onClick={() => removeAlert(alert)}>&times;</a>
                        <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
                    </div>
                )}
            </div>
        </div>
    );
}
