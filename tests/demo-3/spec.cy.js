describe('Testes login', () => {
  it('Teste login com sucesso', () => {
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type('usuario@teste.com')
  cy.get(':nth-child(2) > .relative > .w-full').type('senha123')
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  // ✅ Verificações
  cy.url().should('include', '/home') // verifica se foi redirecionado
  cy.contains('Bem-vindo').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 2 segundos
})

it('Teste login falho', () => {
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type('usuario')
  cy.get(':nth-child(2) > .relative > .w-full').type('senhaerrada')
  cy.get('.bg-blue-600').click()

  // ✅ Verificações
  cy.url().should('include', '/login') // ainda deve estar na página de login
  cy.wait(3000) // espera 2 segundos
})

it('Teste login vazio', () => {
  cy.visit('http://localhost:5173/login')
  cy.get('.bg-blue-600').click()

  // ✅ Verificações
  cy.url().should('include', '/login') // ainda deve estar na página de login
  cy.wait(3000) // espera 2 segundos
  })
  
  it('Teste logout', () => {
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type('usuario@teste.com')
  cy.get(':nth-child(2) > .relative > .w-full').type('senha123')
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('.space-x-1 > .hidden').click()
  // ✅ Verificações
  cy.url().should('include', '/login') // deve estar na página de login
  cy.wait(3000) // espera 2 segundos
  })

})


describe('Testes Avaliações', () => {
  it('Teste Avaliação de mídia', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.get(':nth-child(1) > .space-x-4 > :nth-child(4) > .bg-white > .relative > .absolute').click()
  cy.get('.gap-3 > .w-full').click()
  cy.get('.space-y-4 > :nth-child(2) > .w-full').type('Ótimo, recomendo!')
  cy.get('.bg-blue-600').click()

  // ✅ Verificações
  cy.contains('Avaliação enviada com sucesso!').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 2 segundos
})
  it('Teste Avaliação de mídia já avaliada', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.get(':nth-child(1) > .space-x-4 > :nth-child(4) > .bg-white > .relative > .absolute').click()
  cy.get('.space-y-4 > :nth-child(2) > .w-full').type('Ótimo, recomendo!')
  cy.get('.bg-blue-600').click()

  // ✅ Verificações
  cy.contains('Movie já foi avaliado por este usuário. Use PUT para atualizar ou DELETE para remover.').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 2 segundos
})
 
  it('Atualizando avaliação de uma obra', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('.space-x-4 > .space-x-2').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.mt-auto > .w-full').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.space-y-4 > :nth-child(2) > .w-full').type(' Mas vi de novo e achei marromeno')
  cy.get('.bg-blue-600').click()
  // ✅ Verificações
  cy.contains('Avaliação atualizada com sucesso!').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 3 segundos
  })
  
  it('Excluindo avaliação de uma obra', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('.space-x-4 > .space-x-2').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.mt-auto > .w-full').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.bg-red-600').click()
  // ✅ Verificações
  cy.contains('Avaliação deletada com sucesso!').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 3 segundos
  })

  it('Criação de Lista', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('[href="/lists"] > span').click()
  cy.get('.mb-10 > .flex').click()
  cy.wait(3000) // espera 2 segundos
  cy.get(':nth-child(1) > .w-full').type('Lista da DALVA')
  cy.get(':nth-child(2) > .w-full').type('Descrição da lista da DALVA')
  cy.get('.space-y-4 > .flex > .bg-blue-600').click()

  // ✅ Verificações
  cy.contains('Lista criada com sucesso!').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 2 segundos
  })

  it('Criação de Lista sem nome', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('[href="/lists"] > span').click()
  cy.get('.mb-10 > .flex').click()
  cy.wait(3000) // espera 2 segundos
  cy.get('.space-y-4 > .flex > .bg-blue-600').click()
  cy.get('.bg-slate-200').click()

  // ✅ Verificações
  cy.contains('Digite um nome para a lista').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 2 segundos
  })

  it('Adicionando série à Lista', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('[href="/series"] > span').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.max-w-md > .relative > .w-full').type('Breaking Bad')
  cy.get('.right-2').click()
  cy.wait(2000) // espera 2 segundos
  cy.get(':nth-child(1) > .p-4 > .space-x-2 > .bg-slate-200').click()
  cy.get('li > .w-full').click()
  cy.contains('adicionado à lista').should('be.visible')
  cy.wait(3000) // espera 2 segundos
  })

  it('Adicionando anime à Lista', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('[href="/anime"] > span').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.max-w-md > .relative > .w-full').type('Death Note')
  cy.get('.right-2').click()
  cy.wait(2000) // espera 2 segundos
  cy.get(':nth-child(1) > .p-4 > .space-x-2 > .bg-slate-200').click()
  cy.get('li > .w-full').click()
  cy.contains('adicionado à lista').should('be.visible')
  cy.wait(3000) // espera 2 segundos
  })
  
  it('Adicionando filme à Lista', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('[href="/movies"] > span').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.max-w-7xl > :nth-child(3) > .relative > .w-full').type('Nossa Culpa')
  cy.get('.right-2').click()
  cy.wait(2000) // espera 2 segundos
  cy.get(':nth-child(1) > .p-4 > .space-x-2 > .bg-slate-200').click()
  cy.get('li > .w-full').click()
  cy.contains('adicionado à lista').should('be.visible')
  cy.wait(3000) // espera 2 segundos
  })

  it('Adicionando obra repetida na Lista', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('[href="/movies"] > span').click()
  cy.wait(2000) // espera 2 segundos
  cy.get('.max-w-7xl > :nth-child(3) > .relative > .w-full').type('Nossa Culpa')
  cy.get('.right-2').click()
  cy.wait(2000) // espera 2 segundos
  cy.get(':nth-child(1) > .p-4 > .space-x-2 > .bg-slate-200').click()
  cy.get('li > .w-full').click()
  cy.contains('Essa mídia já está na lista').should('be.visible')
  cy.wait(3000) // espera 2 segundos
  })

  it('Exclusão de Lista', () => {
  const nome = `User_${Math.random().toString(36).substring(2, 7)}`
  const email = `${nome}@teste.com`
  const senha = 'senha123'
  cy.visit('http://localhost:5173/login')
  cy.get(':nth-child(1) > .relative > .w-full').type(email)
  cy.get(':nth-child(2) > .relative > .w-full').type(senha)
  cy.get('.bg-blue-600').click()
  cy.wait(5000) // espera 5 segundos
  cy.get('[href="/lists"] > span').click()
  cy.wait(3000) // espera 2 segundos
  cy.get('.text-red-600').click()
  // ✅ Verificações
  cy.contains('Lista excluída com sucesso!').should('be.visible') // verifica texto esperado
  cy.wait(3000) // espera 2 segundos
  })
})