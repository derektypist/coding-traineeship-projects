// Returns a random DNA base
const returnRandBase = () => {
    const dnaBases = ['A', 'T', 'C', 'G']
    return dnaBases[Math.floor(Math.random() * 4)] 
  }
  
  // Returns a random single stand of DNA containing 15 bases
  const mockUpStrand = () => {
    const newStrand = []
    for (let i = 0; i < 15; i++) {
      newStrand.push(returnRandBase())
    }
    return newStrand
  }
  
  let currentDNA = mockUpStrand()
  
  const pAequorFactory = (specimenNum, dna) => {
    return {
      specimenNum: specimenNum, 
      dna:dna,
      mutate () {
        let randomIndex = Math.floor(Math.random() * this.dna.length)
        let newBase = returnRandBase();
        while (this.dna[randomIndex] === newBase) {
          newBase = returnRandBase()
        }
        this.dna[randomIndex] = newBase
        return this.dna
      },
      compareDNA () {
        let example1 = this.dna
        let example2 = currentDNA
        let score = 0
        for (let j=0;j<example1.length;j++) {
          for (let k=0;k<example2.length;k++) {
            if (j===k && example1[j] === example2[k]) score += 1;
          }
        }
        console.log(`Specimen 1 and 2 have ${Math.floor(100/15 * score)}% DNA in common`)
      },
      willLikelySurvive() {
       let countCG = 0
       for (let i=0;i<this.dna.length;i++) {
         if (this.dna[i] === 'C' || this.dna[i]==='G') countCG += 1
       }
        let ratio = countCG/this.dna.length
        return ratio >= 0.6
      }
      }
  }
  
  const mutant1 = pAequorFactory(1,mockUpStrand())
  const mutant2 = pAequorFactory(2,mockUpStrand())
  
  console.log(mutant1.mutate())
  console.log(mutant2.mutate())
  console.log(mutant1.dna)
  console.log(mutant2.dna)
  mutant1.compareDNA()
  mutant2.compareDNA()
  console.log(mutant1.willLikelySurvive())
  console.log(mutant2.willLikelySurvive())
  
  let luckyMutants = []
  let mutantCount = 0
  while (luckyMutants.length <=30) {
    let mutant = pAequorFactory(mutantCount,mockUpStrand())
    if (mutant.willLikelySurvive()) luckyMutants.push(mutant)
    mutantCount++
  }
  
  console.log(luckyMutants)
  console.log(mutantCount)
    