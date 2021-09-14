import Git from 'nodegit'

async function main() {

  try {

    let repository = await Git.Repository.open('.')
    let status = await repository.getStatus()
      
    status.forEach((item) => {
      console.log(item.path())
    })

    console.log()

  } catch (error) {
    console.error(error)
  }

}

main()
