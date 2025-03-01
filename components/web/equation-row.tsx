import {sliceFromLastSpace, sliceStringBeforeLastWord} from "@/lib/utils";
import {Equation} from "@/lib/types/equation";
import {EquationEnvironment, Identifier} from "@/lib/types/identifiers";
import {Input} from "../ui/input";
import {useState, useEffect} from "react";
import Autocomplete from "@/components/web/autocomplete";

interface EquationRowProps {
    equation: Equation;
    environment: EquationEnvironment;
}

const EquationRow = (props: EquationRowProps) => {
    const {equation, environment} = props;
    const [lhs, setLhs] = useState<string>(equation.lhs);
    const [rhs, setRhs] = useState<string>(equation.rhs);
    const [tailStr, setTailStr] = useState<string>('');
    const [autocompletePosition, setAutocompletePosition] = useState({
        x: 0,
        y: 0
    });
    const [completions, setCompletions] = useState<Identifier[]>([])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
        const input = e.target;
        // Get the 'tail' (i.e. string from last whitespace to current
        // cursor location in the input) to use as seed for finding completions.
        updateAutocompletePosition(e)
        updateCompletions(e.target.value)
        setTailStr(tailStr)
        setter(e.target.value)
    }
    const handleInputOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTailStr('')
        setCompletions([])
    }
    const handleInputOnFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateAutocompletePosition(e)
        updateCompletions(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, setter: (value: string) => void) => {
        console.log('event')
        console.log(e)
        if (e.key === 'Tab') {
            e.preventDefault()
            if (completions.length > 0) {
                const base = sliceStringBeforeLastWord(
                    e.currentTarget.value
                )
                setter(base + completions[0].code)
                setCompletions([])
            }
        }
    }
    const updateAutocompletePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Set the initial cursor position to the end of the input's current val
        const cursorPosition = e.target.value.length;

        // Create a temporary span to measure the text up to the cursor.
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        // Preserve spaces and line breaks
        tempSpan.style.whiteSpace = 'pre';
        // Match input font
        tempSpan.style.font = window.getComputedStyle(e.target).font;

        // Add text up to the cursor to the span.
        tempSpan.textContent = e.target.value.substring(0, cursorPosition);

        // Append span to the input's parent to get accurate dimensions.
        if (e.target.parentElement) {
            // Access properties or methods of e.target.parentElement
            e.target.parentElement.appendChild(tempSpan);
        } else {
            // Handle the case where e.target.parentElement is null
            console.log("No parent element found.");
        }

        const rect = tempSpan.getBoundingClientRect();

        // Adjust for input's position and scroll.
        const inputRect = e.target.getBoundingClientRect();
        const scrollLeft = e.target.scrollLeft;
        const scrollTop = e.target.scrollTop;

        setAutocompletePosition({
            x: rect.width + inputRect.left - scrollLeft,
            y: inputRect.top + rect.height - scrollTop + 10,
        });

        // Remove the temporary span.
        if (e.target.parentElement) {
            // Access properties or methods of e.target.parentElement
            e.target.parentElement.removeChild(tempSpan);
        } else {
            // Handle the case where e.target.parentElement is null
            console.log("No parent element found.");
        }

    }
    const updateCompletions = (value: string) => {
        const tailStr = sliceFromLastSpace(value)
        if (tailStr.length === 0) {
            setCompletions([])
        } else {
            const identifiers = Object.values(environment).flat()
            const completions = identifiers.filter(
                x => x.code.startsWith(tailStr) && x.code !== tailStr
            )
            completions.sort((a, b) => a.code.length - b.code.length)
            setCompletions(completions)
        }
    }

    return (
        <div className="flex flex-row items- gap-4 w-full">
            {/* TODO: Get rid of the annoying focus outline! */}
            <Input className="min-w-12 max-w-[300px] font-mono" value={lhs}
                   onChange={(e) => handleInputChange(e, setLhs)}
                   onBlur={(e) => handleInputOnBlur(e)}
                   onFocus={(e) => handleInputOnFocus(e)}
                   onKeyDown={(e) => handleKeyDown(e, setLhs)}
            />
            <span className="text-lg text-gray-500">=</span>
            <Input className="min-w-12 font-mono" value={rhs}
                   onChange={(e) => handleInputChange(e, setRhs)}
                   onBlur={(e) => handleInputOnBlur(e)}
                   onFocus={(e) => handleInputOnFocus(e)}
                   onKeyDown={(e) => handleKeyDown(e, setRhs)}
            />
            <Autocomplete
                xPosition={autocompletePosition.x}
                yPosition={autocompletePosition.y}
                completions={completions}
                // environment={environment}
            />
        </div>
    )
}

export default EquationRow;