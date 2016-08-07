/*
 * ANGULAR CALCULATOR v0.4
 * by Peter Martinson
 * June 22, 2016
 * 
 * @param regA String
 * @param regB String
 * @param regC String
 * @param opA String
 * @param opB String
 * @param b String
 *
 * Pattern is as follows:
 *   A + B * C = D
 *
 *     regA regB regC opA opB screen
 * 1   A                      A (regA)
 * 2   A              +       A (regA)
 * 3   A    B                 B (regB)
 * 4   A    B         +   *   B (regB)
 * 5   A    B    C    +       C (regC)
 * 6   D                      D (regA)
 *
 * b represents the button that has most recently been pressed
 * possible values: 0-9, pm, +/-*, ., root, =
 *
 *          A | B | C |opA|opB|
 *         ---|---|---|---|---|
 * Case 1) 0,A|   |   |   |   | if ( this.opA === 'empty' )
 * Case 2)  A |   |   | + |   | if ( this.opA !== 'empty' && this.regB === 'empty' )
 * Case 3)  A | B |   |+,*|   | if ( this.opA !== 'empty' && this.regA !== 'empty' && this.opB === 'empty' ) -> check opA& b
 * Case 4)  A | B |   | + | * | if ( this.opB !== 'empty' && this.regC === 'empty' ) -> check b
 * Case 5)  A | B | C | + | * | if ( this.opB !== 'empty' && this.regC !== 'empty' ) -> check b
 */

(function () {

    'use strict';

    angular

        // reference to our main app module
        .module('myApp')

        // custom factory for calculator logic
        .factory('calcFactory', function () {

            // init main object; we'll return this later
            var calcObj = {
                chatter: []
            },
                chatObj = {};

            /*
             * DETERMINE CALCULATOR STATE
             *
             *          A | B | C |opA|opB|
             *         ---|---|---|---|---|
             * Case 1) 0,A|   |   |   |   | if ( this.opA === 'empty' )
             * Case 2)  A |   |   | + |   | if ( this.opA !== 'empty' && this.regB === 'empty' )
             * Case 3)  A | B |   |+,*|   | if ( this.opA !== 'empty' && this.regA !== 'empty' && this.opB === 'empty' ) -> check opA& b
             * Case 4)  A | B |   | + | * | if ( this.opB !== 'empty' && this.regC === 'empty' ) -> check b
             * Case 5)  A | B | C | + | * | if ( this.opB !== 'empty' && this.regC !== 'empty' ) -> check b
             */
            function calState(A, B, C, oA, oB) {
                if (A === 'DIV BY 0' || B === 'DIV BY 0') {
                    return 6;
                }
                if (A === 'ERROR' || B === 'ERROR') {
                    return 6;
                } else if (oA === 'empty') {
                    return 1;
                } else if (oA !== 'empty' && B === 'empty') {
                    return 2;
                } else if (oA !== 'empty' && A !== 'empty' && oB === 'empty') {
                    return 3;
                } else if (oB !== 'empty' && C === 'empty') {
                    return 4;
                } else if (oB !== 'empty' && C !== 'empty') {
                    return 5;
                }
            }

            /* 
             * OUTPUT INFORMATION ABOUT VALUE
             * @param v string || number
             */
            function diag(v) {
                console.log("About " + v + ":");
                if (typeof v === 'string') {
                    console.log(v + " is a string with length: " + v.length);
                } else {
                    console.log(v + " is a: " + typeof v + " with value: " + v);
                }
            }

            /*
             * TRIM ALL VALUES TO 10 CHARACTERS OR LESS
             * @param num number
             */
            function trim(num) {
                var numLen, truncLen, tempVal;

                numLen = num.toString().length;
                truncLen = (Math.trunc(Number(num))).toString().length;
                if (numLen === truncLen && numLen > 10) {
                    num = 'ERROR';
                } else if (numLen > truncLen) {
                    tempVal = (Math.round(Number(num) * Math.pow(10, (10 - truncLen)))) / Math.pow(10, (10 - truncLen));
                    num = tempVal.toString();
                }
                return num.toString();
            }

            /*
             * PERFORM A SINGLE OPERATION
             * @param l string
             * @param o string
             * @param r string
             * pattern: A + B -> l o r
             */
            function operate(l, o, r) {
                diag(l);
                diag(o);
                diag(r);
                l = Number(l);
                r = Number(r);
                if (o === '+') {
                    return trim((l + r).toString());
                }
                if (o === '-') {
                    return trim((l - r).toString());
                }
                if (o === '*') {
                    return trim((l * r).toString());
                }
                if (o === '/') {
                    if (r === 0) {
                        return 'DIV BY 0';
                    }
                    return trim((l / r).toString());
                }
            }

            calcObj.inBuffer = {
                regA: 'empty',
                regB: 'empty',
                regC: 'empty',
                opA: 'empty',
                opB: 'empty',
                screenFlag: 1, // 1 -> show regA, 2 -> show regB, 3 -> show regC
                screen: '0',

                updateBuffer: function (b) {

                    /*
                     * CLEAR THE BUFFER
                     */
                    if (b === 'C') {
                        this.screenFlag = 1;
                        this.regA = 'empty';
                        this.regB = 'empty';
                        this.regC = 'empty';
                        this.opA = 'empty';
                        this.opB = 'empty';
                        calcObj.chatter.length = 0;
                    }

                    /*
                     * ENTER A NUMBER
                     *
                     *          A | B | C |opA|opB|
                     *         ---|---|---|---|---|
                     * Case 1) 0,A|   |   |   |   | (regA=0) replace regA, (regA=N,<10char) append to regA
                     * Case 2)  A |   |   | + |   | Replace regB
                     * Case 3)  A | B |   |+,*|   | (regB<10char) Append to regB
                     * Case 4)  A | B |   | + | * | Replace regC
                     * Case 5)  A | B | C | + | * | (regC<10char) Append to regC
                     */
                    if (typeof b === 'number') {
                        switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
                        case 1:
                            if (this.regA === 'empty' || this.regA === '0') {
                                this.regA = b.toString();
                                this.screenFlag = 1;
                            } else if (this.regA.toString().length < 10) {
                                this.regA = this.regA.toString() + b;
                                this.screenFlag = 1;
                            }
                            break;
                        case 2:
                            this.regB = b.toString();
                            this.screenFlag = 2;
                            break;
                        case 3:
                            if (this.regB.toString().length < 10) {
                                this.regB = this.regB.toString() + b;
                                this.screenFlag = 2;
                            }
                            break;
                        case 4:
                            this.regC = b.toString();
                            this.screenFlag = 3;
                            break;
                        case 5:
                            if (this.regC.toString().length < 10) {
                                this.regC = this.regC.toString() + b;
                                this.screenFlag = 3;
                            }
                            break;
                        case 6:
                            break;
                        default:
                            console.log("something other than NUMBER happened!");
                            break;
                        }
                    }

                    /*
                     * ENTER AN OPERATOR
                     *
                     *          A | B | C |opA|opB|
                     *         ---|---|---|---|---|
                     * Case 1) 0,A|   |   |   |   | -> opA
                     * Case 2)  A |   |   | + |   | -> opA
                     * Case 3)  A | B |   |+,*|   | (opA=+,* b=+) operate & b->opA; (aO=+ b=*) b->opB
                     * Case 4)  A | B |   | + | * | (b=*) b->opB; (b=+) B->regC, op(A,opA,op(B,opB,C))
                     * Case 5)  A | B | C | + | * | (b=*) B=op(B,opB,C), b->opB; (b=+), op(A,opA,op(B,opB,C))
                     */
                    // ======================= enter an operator
                    if (b === '+' || b === '-' || b === '*' || b === '/') {
                        switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
                        case 1:
                            this.opA = b;
                            this.screenFlag = 1;
                            break;
                        case 2:
                            this.opA = b;
                            this.screenFlag = 1;
                            break;
                        case 3:
                            if ((this.opA === '+' || this.opA === '-') && (b === '*' || b === '/')) {
                                this.opB = b;
                                this.screenFlag = 2;
                            } else {
                                this.regA = operate(this.regA, this.opA, this.regB);
                                this.opA = b;
                                this.screenFlag = 1;
                            }
                            break;
                        case 4:
                            if (b === '+' || b === '-') {
                                this.regB = operate(this.regA, this.opA,
                                                    operate(this.regB, this.opB, this.regB));
                                this.regA = 'empty';
                                this.regC = 'empty';
                                this.opB = 'empty';
                                this.opA = b;
                                this.screenFlag = 1;
                            } else {
                                this.opB = b;
                                this.screenFlag = 2;
                            }
                            break;
                        case 5:
                            if (b === '+' || b === '-') {
                                this.regB = operate(this.regA, this.opA,
                                                    operate(this.regB, this.opB, this.regC));
                                this.regA = 'empty';
                                this.regC = 'empty';
                                this.opB = 'empty';
                                this.opA = b;
                                this.screenFlag = 1;
                            } else {
                                this.regB = operate(this.regB, this.opB, this.regC);
                                this.regC = 'empty';
                                this.opB = b;
                                this.screenFlag = 2;
                            }
                            break;
                        case 6:
                            break;
                        default:
                            console.log("something other than OPERATOR happened!");
                            break;
                        }
                    }

                    /*
                     * ENTER +/-
                     *
                     *          A | B | C |opA|opB|
                     *         ---|---|---|---|---|
                     * Case 1) 0,A|   |   |   |   | 
                     * Case 2)  A |   |   | + |   | 
                     * Case 3)  A | B |   |+,*|   | 
                     * Case 4)  A | B |   | + | * | 
                     * Case 5)  A | B | C | + | * | 
                     */
                    if (b === 'pm') {
                        switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
                        case 1:
                            if (this.regA !== 'empty' && this.regA !== '0') {
                                this.regA = Number(this.regA * -1).toString();
                                this.screenFlag = 1;
                            }
                            break;
                        case 2:
                            this.regB = Number(this.regA * -1).toString();
                            this.screenFlag = 2;
                            break;
                        case 3:
                            this.regB = Number(this.regB * -1).toString();
                            this.screenFlag = 2;
                            break;
                        case 4:
                            this.regC = Number(this.regB * -1).toString();
                            this.screenFlag = 3;
                            break;
                        case 5:
                            this.regC = Number(this.regC * -1).toString();
                            this.screenFlag = 3;
                            break;
                        case 6:
                            break;
                        default:
                            console.log("something other than PLUS-MINUS happened!");
                            break;
                        }
                    }

                    /*
                     * ENTER .
                     *
                     *          A | B | C |opA|opB|
                     *         ---|---|---|---|---|
                     * Case 1) 0,A|   |   |   |   | if 0/null, 0.->A; if length<10, A+='.'
                     * Case 2)  A |   |   | + |   | 0.->B, screenFlag=2 
                     * Case 3)  A | B |   |+,*|   | if length<10, B+='.'
                     * Case 4)  A | B |   | + | * | 0.->C, screenFlag=3
                     * Case 5)  A | B | C | + | * | if length<10, C+='.'
                     */
                    if (b === '.') {
                        switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
                        case 1:
                            if (this.regA.indexOf('.') === -1 && this.regA.length < 10) {
                                if (this.regA === 'empty' || this.regA === '0') {
                                    this.regA = '0.';
                                } else {
                                    this.regA = this.regA.toString() + '.';
                                }
                            }
                            break;
                        case 2:
                            this.regB = '0.';
                            this.screenFlag = 2;
                            break;
                        case 3:
                            if (this.regB.indexOf('.') === -1 && this.regB.length < 10) {
                                this.regB = this.regB.toString() + '.';
                            }
                            break;
                        case 4:
                            this.regC = '0.';
                            this.screenFlag = 3;
                            break;
                        case 5:
                            if (this.regC.indexOf('.') === -1 && this.regC.length < 10) {
                                this.regC = this.regC.toString() + '.';
                            }
                            break;
                        case 6:
                            break;
                        default:
                            console.log("something other than . happened!");
                            break;
                        }
                    }

                    /*
                     * ENTER SQUARE ROOT
                     *
                     *          A | B | C |opA|opB|
                     *         ---|---|---|---|---|
                     * Case 1) 0,A|   |   |   |   | if A>0, sqrt(A)->A, else ERROR
                     * Case 2)  A |   |   | + |   | if A>0, sqrt(A)->B, else ERROR
                     * Case 3)  A | B |   |+,*|   | if B>0, sqrt(B)->B, else ERROR
                     * Case 4)  A | B |   | + | * | if B>0, sqrt(B)->C, else ERROR
                     * Case 5)  A | B | C | + | * | if C>0, sqrt(C)->C, else ERROR
                     */
                    // enter square-root
                    if (b === 'root') {
                        switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
                        case 1:
                            if (this.regA > 0) {
                                this.regA = trim(Math.sqrt(Number(this.regA)).toString());
                                this.screenFlag = 1;
                            } else if (this.regA === 'empty' || this.regA === '0') {
                                this.regA = '0';
                                this.screenFlag = 1;
                            } else {
                                this.regA = 'ERROR';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            }
                            break;
                        case 2:
                            if (this.regA > 0) {
                                this.regB = trim(Math.sqrt(Number(this.regA)).toString());
                                this.screenFlag = 2;
                            } else {
                                this.regA = 'ERROR';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            }
                            break;
                        case 3:
                            if (this.regB > 0) {
                                this.regB = trim(Math.sqrt(Number(this.regB)).toString());
                                this.screenFlag = 2;
                            } else {
                                this.regA = 'ERROR';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            }
                            break;
                        case 4:
                            if (this.regB > 0) {
                                this.regC = trim(Math.sqrt(Number(this.regB)).toString());
                                this.screenFlag = 3;
                            } else {
                                this.regA = 'ERROR';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            }
                            break;
                        case 5:
                            if (this.regC > 0) {
                                this.regC = trim(Math.sqrt(Number(this.regC)).toString());
                                this.screenFlag = 3;
                            } else {
                                this.regA = 'ERROR';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            }
                            break;
                        case 6:
                            break;
                        default:
                            console.log("something other than . happened!");
                            break;
                        }
                    }

                    /*
                     * ENTER =
                     *
                     *          A | B | C |opA|opB|
                     *         ---|---|---|---|---|
                     * Case 1) 0,A|   |   |   |   | do nothing!
                     * Case 2)  A |   |   | + |   | B->A, operate
                     * Case 3)  A | B |   |+,*|   | operate
                     * Case 4)  A | B |   | + | * | C->B, operate(operate)
                     * Case 5)  A | B | C | + | * | operate(operate)
                     */
                    if (b === '=') {
                        this.screenFlag = 1;
                        switch (calState(this.regA, this.regB, this.regC, this.opA, this.opB)) {
                        case 1:
                            break;
                        case 2:
                            this.regA = operate(this.regA, this.opA, this.regA);
                            if (this.regA === 'DIV BY 0') {
                                this.regA = 'DIV BY 0';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            } else {
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                            }
                            break;
                        case 3:
                            this.regA = operate(this.regA, this.opA, this.regB);
                            if (this.regA === 'DIV BY 0') {
                                this.regA = 'DIV BY 0';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            } else {
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                            }
                            break;
                        case 4:
                            this.regA = operate(this.regA, this.opA,
                                                operate(this.regB, this.opB, this.regB));
                            if (this.regA === 'DIV BY 0') {
                                this.regA = 'DIV BY 0';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            } else {
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                            }
                            break;
                        case 5:
                            this.regA = operate(this.regA, this.opA,
                                                operate(this.regB, this.opB, this.regC));
                            if (this.regA === 'DIV BY 0') {
                                this.regA = 'DIV BY 0';
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                                this.screenFlag = 1;
                            } else {
                                this.regB = 'empty';
                                this.regC = 'empty';
                                this.opA = 'empty';
                                this.opB = 'empty';
                            }
                            break;
                        case 6:
                            break;
                        default:
                            console.log("something other than . happened!");
                            break;
                        }
                    }

                    // update the screen
                    if (this.screenFlag === 1) {
                        if (this.regA === 'empty') {
                            this.screen = '0';
                        } else {
                            this.screen = this.regA;
                        }
                        // calcObj.chatter.push('screen = regA');
                        chatObj.screen = 'regA';
                    }
                    if (this.screenFlag === 2) {
                        this.screen = this.regB;
                        // calcObj.chatter.push('screen = regB');
                        chatObj.screen = 'regB';
                    }
                    if (this.screenFlag === 3) {
                        this.screen = this.regC;
                        // calcObj.chatter.push('screen = regC');
                        chatObj.screen = 'regC';
                    }

                    // calcObj.chatter.push('regA = ' + this.regA);
                    chatObj.regA = this.regA;

                    // calcObj.chatter.push('regB = ' + this.regB);
                    chatObj.regB = this.regB;

                    // calcObj.chatter.push('regC = ' + this.regC);
                    chatObj.regC = this.regC;

                    // calcObj.chatter.push('opA = ' + this.opA);
                    chatObj.opA = this.opA;

                    // calcObj.chatter.push('opB = ' + this.opB);
                    chatObj.opB = this.opB;

                    calcObj.chatter.push(chatObj);
                    chatObj = {};


                    return {
                        regA: this.regA,
                        regB: this.regB,
                        regC: this.regC,
                        opA: this.opA,
                        opB: this.opB,
                        screen: this.screen
                    };
                }
            };

            // return our object
            return calcObj;

        });
})();