import React from "react";

interface LoadingProps {
  text?: string;
  nivel?: string;
  carga?: boolean;
}

/**
 * Componente `Loading` que muestra una barra de progreso o un spinner animado.
 *
 * @param {boolean} [carga] - Si es `true`, se muestra una barra de progreso. Si es `false` o no se especifica, se muestra un spinner.
 * @param {string} [nivel] - El valor porcentual de carga (ej. "70%"), usado solo si `carga` es `true`.
 * @param {string} [text] - Texto que se muestra debajo del indicador de carga.
 *
 * @returns {JSX.Element} El componente visual de carga.
 *
 * @example
 * <Loading carga={true} nivel="70%" text="Cargando datos..." />
 * <Loading carga={false} text="Procesando..." />
 */
const Loading: React.FC<LoadingProps> = ({
  carga = false,
  nivel = "0%",
  text = "",
}) => {
  return (
    <div>
      <div className="absolute_loading">
        {carga ? (
          <div>
            <div id="div_barra">
              <div className="progressbar-container">
                <div className="progressbar-complete" style={{ width: nivel }}>
                  <div className="progressbar-liquid"></div>
                </div>
                <span className="porcentaje">{nivel}</span>
              </div>
            </div>
            <div className="text_load">{text}</div>
          </div>
        ) : (
          <div>
            <div id="spinner_conteiner">
              <div id="loading-bar-spinner" className="spinner">
                <div className="spinner-icon"></div>
              </div>
            </div>
            <div className="text_load">{text}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
