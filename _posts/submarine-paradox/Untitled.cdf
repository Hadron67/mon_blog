(* Content-type: application/vnd.wolfram.cdf.text *)

(*** Wolfram CDF File ***)
(* http://www.wolfram.com/cdf *)

(* CreatedBy='Mathematica 9.0' *)

(*************************************************************************)
(*                                                                       *)
(*  The Mathematica License under which this file was created prohibits  *)
(*  restricting third parties in receipt of this file from republishing  *)
(*  or redistributing it by any means, including but not limited to      *)
(*  rights management or terms of use, without the express consent of    *)
(*  Wolfram Research, Inc. For additional information concerning CDF     *)
(*  licensing and redistribution see:                                    *)
(*                                                                       *)
(*        www.wolfram.com/cdf/adopting-cdf/licensing-options.html        *)
(*                                                                       *)
(*************************************************************************)

(*CacheID: 234*)
(* Internal cache information:
NotebookFileLineBreakTest
NotebookFileLineBreakTest
NotebookDataPosition[      1063,         20]
NotebookDataLength[     14617,        538]
NotebookOptionsPosition[     14248,        502]
NotebookOutlinePosition[     14747,        524]
CellTagsIndexPosition[     14704,        521]
WindowFrame->Normal*)

(* Beginning of Notebook Content *)
Notebook[{
Cell[BoxData[{
 RowBox[{
  RowBox[{"g", "=", 
   RowBox[{"{", 
    RowBox[{"1", ",", 
     RowBox[{"-", "1"}], ",", 
     RowBox[{"-", "1"}]}], "}"}]}], ";"}], "\[IndentingNewLine]", 
 RowBox[{
  RowBox[{"x1", "=", 
   RowBox[{"{", 
    RowBox[{
     RowBox[{
      FractionBox[
       SuperscriptBox["c", "2"], "a"], " ", 
      RowBox[{"Sinh", "[", 
       RowBox[{
        FractionBox["a", "c"], "\[Tau]"}], "]"}]}], ",", 
     RowBox[{
      FractionBox[
       SuperscriptBox["c", "2"], "a"], " ", 
      RowBox[{"Cosh", "[", 
       RowBox[{
        FractionBox["a", "c"], "\[Tau]"}], "]"}]}], ",", 
     RowBox[{"v", " ", "\[Tau]"}]}], "}"}]}], ";"}], "\[IndentingNewLine]", 
 RowBox[{
  RowBox[{"t1", "=", 
   RowBox[{
    FractionBox["1", 
     SqrtBox[
      RowBox[{
       SuperscriptBox["c", "2"], "-", 
       SuperscriptBox["v", "2"]}]]], 
    RowBox[{"{", 
     RowBox[{
      RowBox[{"c", " ", 
       RowBox[{"Cosh", "[", 
        RowBox[{
         FractionBox["a", "c"], "\[Tau]"}], "]"}]}], ",", 
      RowBox[{"c", " ", 
       RowBox[{"Sinh", "[", 
        RowBox[{
         FractionBox["a", "c"], "\[Tau]"}], "]"}]}], ",", "v"}], "}"}]}]}], 
  ";"}], "\[IndentingNewLine]", 
 RowBox[{
  RowBox[{"n1", "=", 
   RowBox[{"{", 
    RowBox[{
     RowBox[{"Sinh", "[", 
      RowBox[{
       FractionBox["a", "c"], "\[Tau]"}], "]"}], ",", 
     RowBox[{"Cosh", "[", 
      RowBox[{
       FractionBox["a", "c"], "\[Tau]"}], "]"}], ",", "0"}], "}"}]}], 
  ";"}], "\[IndentingNewLine]", 
 RowBox[{
  RowBox[{"n2", "=", 
   RowBox[{
    FractionBox["1", 
     SqrtBox[
      RowBox[{
       SuperscriptBox["c", "2"], "-", 
       SuperscriptBox["v", "2"]}]]], 
    RowBox[{"{", 
     RowBox[{
      RowBox[{"v", " ", 
       RowBox[{"Cosh", "[", 
        RowBox[{
         FractionBox["a", "c"], "\[Tau]"}], "]"}]}], ",", 
      RowBox[{"v", " ", 
       RowBox[{"Sinh", "[", 
        RowBox[{
         FractionBox["a", "c"], "\[Tau]"}], "]"}]}], ",", "c"}], "}"}]}]}], 
  ";"}]}], "Input", "PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{
  RowBox[{
   RowBox[{"Mmul", "[", 
    RowBox[{"a_", ",", "b_"}], "]"}], ":=", 
   RowBox[{
    SubsuperscriptBox["\[Sum]", 
     RowBox[{"i", "=", "1"}], "3"], 
    RowBox[{
     RowBox[{"g", "[", 
      RowBox[{"[", "i", "]"}], "]"}], 
     RowBox[{"a", "[", 
      RowBox[{"[", "i", "]"}], "]"}], 
     RowBox[{"b", "[", 
      RowBox[{"[", "i", "]"}], "]"}]}]}]}], ";"}]], "Input", \
"PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{
  RowBox[{"r1", "=", 
   RowBox[{
    RowBox[{"{", 
     RowBox[{
      RowBox[{"c", " ", "t"}], ",", "x", ",", "y"}], "}"}], "-", "x1"}]}], 
  ";"}]], "Input", "PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{
  RowBox[{"equ", "=", "\[IndentingNewLine]", 
   RowBox[{
    RowBox[{
     RowBox[{"Simplify", "@", 
      RowBox[{"Mmul", "[", 
       RowBox[{"r1", ",", "t1"}], "]"}]}], "\[Equal]", "0"}], "&&", 
    "\[IndentingNewLine]", 
    RowBox[{"r1", "\[Equal]", 
     RowBox[{
      RowBox[{"\[Mu]", " ", "n1"}], "+", 
      RowBox[{"\[Lambda]", " ", "n2"}]}]}]}]}], ";"}]], "Input", \
"PluginEmbeddedContent"],

Cell[CellGroupData[{

Cell[BoxData[
 RowBox[{"solution", "=", 
  RowBox[{"Simplify", "@", 
   RowBox[{
    RowBox[{"Solve", "[", 
     RowBox[{"equ", ",", 
      RowBox[{"{", 
       RowBox[{"t", ",", "x", ",", "y"}], "}"}]}], "]"}], "[", 
    RowBox[{"[", "1", "]"}], "]"}]}]}]], "Input", "PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{"{", 
  RowBox[{
   RowBox[{"t", "\[Rule]", 
    FractionBox[
     RowBox[{
      FractionBox[
       RowBox[{"v", " ", "\[Lambda]", " ", 
        RowBox[{"Cosh", "[", 
         FractionBox[
          RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
       SqrtBox[
        RowBox[{
         SuperscriptBox["c", "2"], "-", 
         SuperscriptBox["v", "2"]}]]], "+", 
      FractionBox[
       RowBox[{
        RowBox[{"(", 
         RowBox[{
          SuperscriptBox["c", "2"], "+", 
          RowBox[{"a", " ", "\[Mu]"}]}], ")"}], " ", 
        RowBox[{"Sinh", "[", 
         FractionBox[
          RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "a"]}], "c"]}], ",", 
   RowBox[{"x", "\[Rule]", 
    RowBox[{
     RowBox[{
      RowBox[{"(", 
       RowBox[{
        FractionBox[
         SuperscriptBox["c", "2"], "a"], "+", "\[Mu]"}], ")"}], " ", 
      RowBox[{"Cosh", "[", 
       FractionBox[
        RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "+", 
     FractionBox[
      RowBox[{"v", " ", "\[Lambda]", " ", 
       RowBox[{"Sinh", "[", 
        FractionBox[
         RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
      SqrtBox[
       RowBox[{
        SuperscriptBox["c", "2"], "-", 
        SuperscriptBox["v", "2"]}]]]}]}], ",", 
   RowBox[{"y", "\[Rule]", 
    RowBox[{
     FractionBox[
      RowBox[{"c", " ", "\[Lambda]"}], 
      SqrtBox[
       RowBox[{
        SuperscriptBox["c", "2"], "-", 
        SuperscriptBox["v", "2"]}]]], "+", 
     RowBox[{"v", " ", "\[Tau]"}]}]}]}], "}"}]], "Output", \
"PluginEmbeddedContent"]
}, Open  ]],

Cell[CellGroupData[{

Cell[BoxData[
 RowBox[{
  RowBox[{"r2", "=", 
   RowBox[{
    RowBox[{"{", 
     RowBox[{
      RowBox[{"c", " ", "t"}], ",", "x", ",", "y"}], "}"}], "/.", 
    "solution"}]}], "\[IndentingNewLine]"}]], "Input", \
"PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{"{", 
  RowBox[{
   RowBox[{
    FractionBox[
     RowBox[{"v", " ", "\[Lambda]", " ", 
      RowBox[{"Cosh", "[", 
       FractionBox[
        RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
     SqrtBox[
      RowBox[{
       SuperscriptBox["c", "2"], "-", 
       SuperscriptBox["v", "2"]}]]], "+", 
    FractionBox[
     RowBox[{
      SuperscriptBox["c", "2"], " ", 
      RowBox[{"Sinh", "[", 
       FractionBox[
        RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "a"], "+", 
    RowBox[{"\[Mu]", " ", 
     RowBox[{"Sinh", "[", 
      FractionBox[
       RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}]}], ",", 
   RowBox[{
    FractionBox[
     RowBox[{
      SuperscriptBox["c", "2"], " ", 
      RowBox[{"Cosh", "[", 
       FractionBox[
        RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "a"], "+", 
    RowBox[{"\[Mu]", " ", 
     RowBox[{"Cosh", "[", 
      FractionBox[
       RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "+", 
    FractionBox[
     RowBox[{"v", " ", "\[Lambda]", " ", 
      RowBox[{"Sinh", "[", 
       FractionBox[
        RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
     SqrtBox[
      RowBox[{
       SuperscriptBox["c", "2"], "-", 
       SuperscriptBox["v", "2"]}]]]}], ",", 
   RowBox[{
    FractionBox[
     RowBox[{"c", " ", "\[Lambda]"}], 
     SqrtBox[
      RowBox[{
       SuperscriptBox["c", "2"], "-", 
       SuperscriptBox["v", "2"]}]]], "+", 
    RowBox[{"v", " ", "\[Tau]"}]}]}], "}"}]], "Output", \
"PluginEmbeddedContent"]
}, Open  ]],

Cell[CellGroupData[{

Cell[BoxData[{
 RowBox[{"dt", "=", 
  RowBox[{"{", 
   RowBox[{
    RowBox[{
     RowBox[{
      SubscriptBox["\[PartialD]", "\[Tau]"], 
      RowBox[{"r2", "[", 
       RowBox[{"[", "1", "]"}], "]"}]}], "/", "c"}], ",", 
    RowBox[{
     SubscriptBox["\[PartialD]", "\[Mu]"], 
     RowBox[{"r2", "[", 
      RowBox[{"[", "1", "]"}], "]"}]}], ",", 
    RowBox[{
     SubscriptBox["\[PartialD]", "\[Lambda]"], 
     RowBox[{"r2", "[", 
      RowBox[{"[", "1", "]"}], "]"}]}]}], "}"}]}], "\[IndentingNewLine]", 
 RowBox[{"dx", "=", 
  RowBox[{"{", 
   RowBox[{
    RowBox[{
     RowBox[{
      SubscriptBox["\[PartialD]", "\[Tau]"], 
      RowBox[{"r2", "[", 
       RowBox[{"[", "2", "]"}], "]"}]}], "/", "c"}], ",", 
    RowBox[{
     SubscriptBox["\[PartialD]", "\[Mu]"], 
     RowBox[{"r2", "[", 
      RowBox[{"[", "2", "]"}], "]"}]}], ",", 
    RowBox[{
     SubscriptBox["\[PartialD]", "\[Lambda]"], 
     RowBox[{"r2", "[", 
      RowBox[{"[", "2", "]"}], "]"}]}]}], "}"}]}], "\[IndentingNewLine]", 
 RowBox[{"dy", "=", 
  RowBox[{"{", 
   RowBox[{
    RowBox[{
     RowBox[{
      SubscriptBox["\[PartialD]", "\[Tau]"], 
      RowBox[{"r2", "[", 
       RowBox[{"[", "3", "]"}], "]"}]}], "/", "c"}], ",", 
    RowBox[{
     SubscriptBox["\[PartialD]", "\[Mu]"], 
     RowBox[{"r2", "[", 
      RowBox[{"[", "3", "]"}], "]"}]}], ",", 
    RowBox[{
     SubscriptBox["\[PartialD]", "\[Lambda]"], 
     RowBox[{"r2", "[", 
      RowBox[{"[", "3", "]"}], "]"}]}]}], "}"}]}]}], "Input", \
"PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{"{", 
  RowBox[{
   FractionBox[
    RowBox[{
     RowBox[{"c", " ", 
      RowBox[{"Cosh", "[", 
       FractionBox[
        RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "+", 
     FractionBox[
      RowBox[{"a", " ", "\[Mu]", " ", 
       RowBox[{"Cosh", "[", 
        FractionBox[
         RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "c"], "+", 
     FractionBox[
      RowBox[{"a", " ", "v", " ", "\[Lambda]", " ", 
       RowBox[{"Sinh", "[", 
        FractionBox[
         RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
      RowBox[{"c", " ", 
       SqrtBox[
        RowBox[{
         SuperscriptBox["c", "2"], "-", 
         SuperscriptBox["v", "2"]}]]}]]}], "c"], ",", 
   RowBox[{"Sinh", "[", 
    FractionBox[
     RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}], ",", 
   FractionBox[
    RowBox[{"v", " ", 
     RowBox[{"Cosh", "[", 
      FractionBox[
       RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
    SqrtBox[
     RowBox[{
      SuperscriptBox["c", "2"], "-", 
      SuperscriptBox["v", "2"]}]]]}], "}"}]], "Output", \
"PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{"{", 
  RowBox[{
   FractionBox[
    RowBox[{
     FractionBox[
      RowBox[{"a", " ", "v", " ", "\[Lambda]", " ", 
       RowBox[{"Cosh", "[", 
        FractionBox[
         RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
      RowBox[{"c", " ", 
       SqrtBox[
        RowBox[{
         SuperscriptBox["c", "2"], "-", 
         SuperscriptBox["v", "2"]}]]}]], "+", 
     RowBox[{"c", " ", 
      RowBox[{"Sinh", "[", 
       FractionBox[
        RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "+", 
     FractionBox[
      RowBox[{"a", " ", "\[Mu]", " ", 
       RowBox[{"Sinh", "[", 
        FractionBox[
         RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], "c"]}], "c"], ",", 
   RowBox[{"Cosh", "[", 
    FractionBox[
     RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}], ",", 
   FractionBox[
    RowBox[{"v", " ", 
     RowBox[{"Sinh", "[", 
      FractionBox[
       RowBox[{"a", " ", "\[Tau]"}], "c"], "]"}]}], 
    SqrtBox[
     RowBox[{
      SuperscriptBox["c", "2"], "-", 
      SuperscriptBox["v", "2"]}]]]}], "}"}]], "Output", \
"PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{"{", 
  RowBox[{
   FractionBox["v", "c"], ",", "0", ",", 
   FractionBox["c", 
    SqrtBox[
     RowBox[{
      SuperscriptBox["c", "2"], "-", 
      SuperscriptBox["v", "2"]}]]]}], "}"}]], "Output", \
"PluginEmbeddedContent"]
}, Open  ]],

Cell[CellGroupData[{

Cell[BoxData[
 RowBox[{"Simplify", "[", 
  RowBox[{
   SuperscriptBox[
    RowBox[{"dt", "[", 
     RowBox[{"[", "1", "]"}], "]"}], "2"], "-", 
   SuperscriptBox[
    RowBox[{"dx", "[", 
     RowBox[{"[", "1", "]"}], "]"}], "2"], "-", 
   SuperscriptBox[
    RowBox[{"dy", "[", 
     RowBox[{"[", "1", "]"}], "]"}], "2"]}], "]"}]], "Input", \
"PluginEmbeddedContent"],

Cell[BoxData[
 FractionBox[
  RowBox[{
   SuperscriptBox["c", "2"], "-", 
   SuperscriptBox["v", "2"], "+", 
   RowBox[{"2", " ", "a", " ", "\[Mu]"}], "+", 
   FractionBox[
    RowBox[{
     SuperscriptBox["a", "2"], " ", 
     RowBox[{"(", 
      RowBox[{
       FractionBox[
        RowBox[{
         SuperscriptBox["v", "2"], " ", 
         SuperscriptBox["\[Lambda]", "2"]}], 
        RowBox[{
         RowBox[{"-", 
          SuperscriptBox["c", "2"]}], "+", 
         SuperscriptBox["v", "2"]}]], "+", 
       SuperscriptBox["\[Mu]", "2"]}], ")"}]}], 
    SuperscriptBox["c", "2"]]}], 
  SuperscriptBox["c", "2"]]], "Output", "PluginEmbeddedContent"]
}, Open  ]],

Cell[CellGroupData[{

Cell[BoxData[
 RowBox[{"Simplify", "[", 
  RowBox[{
   SuperscriptBox[
    RowBox[{"dt", "[", 
     RowBox[{"[", "2", "]"}], "]"}], "2"], "-", 
   SuperscriptBox[
    RowBox[{"dx", "[", 
     RowBox[{"[", "2", "]"}], "]"}], "2"], "-", 
   SuperscriptBox[
    RowBox[{"dy", "[", 
     RowBox[{"[", "2", "]"}], "]"}], "2"]}], "]"}]], "Input", \
"PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{"-", "1"}]], "Output", "PluginEmbeddedContent"]
}, Open  ]],

Cell[CellGroupData[{

Cell[BoxData[
 RowBox[{"Simplify", "[", 
  RowBox[{
   SuperscriptBox[
    RowBox[{"dt", "[", 
     RowBox[{"[", "3", "]"}], "]"}], "2"], "-", 
   SuperscriptBox[
    RowBox[{"dx", "[", 
     RowBox[{"[", "3", "]"}], "]"}], "2"], "-", 
   SuperscriptBox[
    RowBox[{"dy", "[", 
     RowBox[{"[", "3", "]"}], "]"}], "2"]}], "]"}]], "Input", \
"PluginEmbeddedContent"],

Cell[BoxData[
 RowBox[{"-", "1"}]], "Output", "PluginEmbeddedContent"]
}, Open  ]]
},
WindowSize->{565, 1086},
Visible->True,
AuthoredSize->{565, 1086},
ScrollingOptions->{"HorizontalScrollRange"->Fit,
"VerticalScrollRange"->Fit},
ShowCellBracket->False,
Deployed->True,
CellContext->Notebook,
TrackCellChangeTimes->False,
FrontEndVersion->"9.0 for Linux x86 (64-bit) (November 20, 2012)",
StyleDefinitions->"Default.nb"
]
(* End of Notebook Content *)

(* Internal cache information *)
(*CellTagsOutline
CellTagsIndex->{}
*)
(*CellTagsIndex
CellTagsIndex->{}
*)
(*NotebookFileOutline
Notebook[{
Cell[1463, 33, 2029, 72, 247, "Input"],
Cell[3495, 107, 437, 15, 26, "Input"],
Cell[3935, 124, 209, 7, 17, "Input"],
Cell[4147, 133, 429, 13, 62, "Input"],
Cell[CellGroupData[{
Cell[4601, 150, 292, 8, 17, "Input"],
Cell[4896, 160, 1562, 52, 130, "Output"]
}, Open  ]],
Cell[CellGroupData[{
Cell[6495, 217, 238, 8, 40, "Input"],
Cell[6736, 227, 1499, 51, 123, "Output"]
}, Open  ]],
Cell[CellGroupData[{
Cell[8272, 283, 1516, 49, 65, "Input"],
Cell[9791, 334, 1084, 36, 75, "Output"],
Cell[10878, 372, 1084, 36, 75, "Output"],
Cell[11965, 410, 250, 9, 45, "Output"]
}, Open  ]],
Cell[CellGroupData[{
Cell[12252, 424, 367, 12, 22, "Input"],
Cell[12622, 438, 656, 21, 64, "Output"]
}, Open  ]],
Cell[CellGroupData[{
Cell[13315, 464, 367, 12, 22, "Input"],
Cell[13685, 478, 70, 1, 17, "Output"]
}, Open  ]],
Cell[CellGroupData[{
Cell[13792, 484, 367, 12, 22, "Input"],
Cell[14162, 498, 70, 1, 17, "Output"]
}, Open  ]]
}
]
*)

(* End of internal cache information *)

(* NotebookSignature AwDnTTPnWy1AiBgSKYERUrdl *)
