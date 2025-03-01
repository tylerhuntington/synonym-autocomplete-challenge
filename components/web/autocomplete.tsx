import {EquationEnvironment} from "@/lib/types/identifiers";
import {useEffect, useState} from "react";
import {Identifier} from "acorn";

interface AutocompleteProps {
    xPosition: number,
    yPosition: number,
    completions: Identifier[]
}

const Autocomplete = (props: AutocompleteProps) => {
    const {xPosition, yPosition, completions} = props;
    return (
        <>
            {completions.length > 0 &&
                <div
                    style={{
                        position: 'absolute',
                        left: xPosition,
                        top: yPosition,
                        background: 'white',
                        padding: '5px',
                        border: '1px solid gray',
                        zIndex: 10,
                        borderRadius: '5px'
                    }}
                >
                    <ul>
                        {completions.map((c, i) => (
                            <li key={i}
                                className={'font-mono'}
                            style={{
                                backgroundColor: i===0 ? 'yellow' : 'white',
                                color: i===0 ? 'red' : 'black',
                                font: i===0 ? 'red' : 'black'
                            }}
                            >
                                {c.code}
                            </li>))
                        }
                    </ul>
                </div>
            }
        </>
    )
}

export default Autocomplete;