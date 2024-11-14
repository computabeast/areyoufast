import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function AlgorithmPage() {
  return (
    <div className="p-5 pb-20 sm:p-5 lg:px-40 font-[family-name:var(--font-geist-sans)]">
      <footer className="p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-cardfg">About Our Elo Ranking System</h2>
        <p className="mb-4 text-cardfg">
          We use the Elo rating system to rank racers based on their performance in races, similar to the system used in chess.
        </p>
        <h3 className="text-xl font-semibold mb-2 text-cardfg">General Approach</h3>
        <p className="mb-4 text-cardfg">
          In a race, each finishing position is treated as a series of individual victories and defeats.
        </p>
        <ul className="list-disc list-inside ml-4 mb-4 text-cardfg">
          <li>1st place {'"beats"'} all other participants.</li>
          <li>2nd place {'"beats"'} all except 1st place, and so on.</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2 text-cardfg">Elo Adjustment</h3>
        <p className="mb-4 text-cardfg">
          Each participant starts with their current Elo rating. The race is treated as a series of pairwise comparisons. For example, with 10 racers, there are 45 pairwise comparisons 
          <Latex>{'$(\\binom{10}{2} = 45)$'}</Latex>.
        </p>
        <p className="mb-4 text-cardfg">
          The expected score for Racer A against Racer B is:
        </p>
        <div className="bg-cardbg p-4 rounded-lg mb-4 overflow-x-auto">
          <Latex>{'$E_{A,B} = \\frac{1}{1 + 10^{(R_B - R_A) / 400}}$'}</Latex>
        </div>
        <p className="mb-4 text-cardfg">
          If Racer A finishes ahead of Racer B, assign a score of 1 for Racer A and 0 for Racer B.
        </p>
        <p className="mb-4 text-cardfg">
          Update each participant’s Elo rating based on their performance relative to others:
        </p>
        <div className="bg-cardbg p-4 rounded-lg mb-4 overflow-x-auto">
          <Latex>{'$\\Delta R_A = K \\times \\frac{1}{n-1} \\sum_{i=1}^{n-1} (S_{A,i} - E_{A,i})$'}</Latex>
          <p className="mt-2 text-cardfg">Where:</p>
          <ul className="list-disc list-inside ml-4 text-cardfg">
            <li><Latex>{'$K$ is the adjustment factor (our adjustment factor is 32)'}</Latex></li>
            <li><Latex>{'$n$ is the total number of participants'}</Latex></li>
            <li><Latex>{'$S_{A,i}$ is the actual score for Racer A against Racer $i$'}</Latex></li>
            <li><Latex>{'$E_{A,i}$ is the expected score between Racer A and Racer $i$'}</Latex></li>
          </ul>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-cardfg">Example</h3>
        <p className="mb-4 text-cardfg">
          Three racers with initial Elo ratings:
        </p>
        <ul className="list-disc list-inside ml-4 mb-4 text-cardfg">
          <li>Racer A: 1000</li>
          <li>Racer B: 1500</li>
          <li>Racer C: 1200</li>
        </ul>
        <p className="mb-4 text-cardfg">
          Finishing order: A, B, C.
        </p>
        <p className="mb-4 text-cardfg">
          Pairwise comparisons:
        </p>
        <ul className="list-disc list-inside ml-4 mb-4 text-cardfg">
          <li>A {'"beats"'} B and C (2 wins)</li>
          <li>B {'"beats"'} C (1 win)</li>
          <li>C comes in last (0 wins)</li>
        </ul>
        <p className="mb-4 text-cardfg">
          Calculate expected scores and update Elo ratings based on the differences between expected and actual outcomes:
        </p>
        <div className="bg-cardbg p-4 rounded-lg mb-4 overflow-x-auto">
          <p className="mb-2 text-cardfg">Expected scores:</p>
          <ul className="list-disc list-inside ml-4 mb-4 text-cardfg">
            <li><Latex>{'$E_{A,B} = \\frac{1}{1 + 10^{(1500 - 1000) / 400}} = 0.05$'}</Latex></li>
            <li><Latex>{'$E_{A,C} = \\frac{1}{1 + 10^{(1200 - 1000) / 400}} = 0.24$'}</Latex></li>
            <li><Latex>{'$E_{B,C} = \\frac{1}{1 + 10^{(1200 - 1500) / 400}} = 0.76$'}</Latex></li>
          </ul>
          <p className="mb-2 text-cardfg">New Elo ratings:</p>
          <ul className="list-disc list-inside ml-4 mb-4 text-cardfg">
            <li><Latex>{'$R_A = 1000 + 30 \\times (1 - 0.05) + 30 \\times (1 - 0.24) = 1451$'}</Latex></li>
            <li><Latex>{'$R_B = 1500 + 30 \\times (0 - 0.95) + 30 \\times (1 - 0.76) = 1462$'}</Latex></li>
            <li><Latex>{'$R_C = 1200 + 30 \\times (0 - 0.76) + 30 \\times (0 - 0.24) = 1140$'}</Latex></li>
          </ul>
        </div>
        <p className="mb-4 text-cardfg">
          New Elo ratings after the race:
        </p>
        <ul className="list-disc list-inside ml-4 mb-4 text-cardfg">
          <li>Racer A: 1451</li>
          <li>Racer B: 1462</li>
          <li>Racer C: 1140</li>
        </ul>
      </footer>
    </div>
  );
}
