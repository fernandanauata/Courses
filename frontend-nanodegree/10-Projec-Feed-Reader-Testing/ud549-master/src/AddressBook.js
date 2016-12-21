function AddressBook() {
  this.contacts = [];

}

AddressBook.prototype.addContact = function (contact) {
  this.contact.push(contact);
}

AddressBook.prototype.getContact = function (index) {
  return this.contact[index];
}
