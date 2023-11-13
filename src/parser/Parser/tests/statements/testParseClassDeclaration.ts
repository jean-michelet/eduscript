import { AST_NODE_TYPE } from '../../../Nodes/AbstractNode.js'
import Identifier from '../../../Nodes/Expression/Identifier.js'
import { CLASS_MEMBER_VISIBILITY, ClassBodyStatement } from '../../../Nodes/Statement/OOP/ClassBody.js'
import ClassDeclaration from '../../../Nodes/Statement/OOP/ClassDeclaration.js'
import MethodDefinition from '../../../Nodes/Statement/OOP/MethodDefinition.js'
import PropertyDefinition from '../../../Nodes/Statement/OOP/PropertyDefinition.js'
import { expectSourceContext, parseStatements } from '../Parser.test.js'

export default function (): void {
  describe('Test parse ClassDeclaration', () => {
    test('should parse a class declaration', () => {
      const src = 'class Foo {}'
      const stmts = parseStatements(src)

      expect(stmts[0]).toBeInstanceOf(ClassDeclaration)
      expectSourceContext(stmts[0], {
        endTokenPos: src.length
      })

      const instance = stmts[0] as ClassDeclaration

      expect(instance.identifier.name).toBe('Foo')
      expect(instance.body.statements).toHaveLength(0)
      expect(instance.parent).toBeNull()
    })

    test('class declaration can extends another class', () => {
      const src = 'class Foo extends Bar {}'
      const stmts = parseStatements(src)

      expect(stmts[0]).toBeInstanceOf(ClassDeclaration)
      expectSourceContext(stmts[0], {
        endTokenPos: src.length
      })

      const instance = stmts[0] as ClassDeclaration

      expect(instance.identifier.name).toBe('Foo')
      expect((instance.parent as Identifier).name).toBe('Bar')
    })

    test('class declaration can have properties', () => {
      const src = `class Foo { 
          myImplicitPulicProp = 1;

          public myExplicitPulicProp = 1;

          protected myProtectedProp = 1;

          private myPrivateProp = 1;

          // static without initialisation is illegal but enforced during semantic analysis
          static public myStaticProp;
      }`
      const stmts = parseStatements(src)

      expect(stmts[0]).toBeInstanceOf(ClassDeclaration)
      expectSourceContext(stmts[0], {
        endLine: 12,
        endTokenPos: src.length
      })

      const properties = (stmts[0] as ClassDeclaration).body.statements as PropertyDefinition[]
      expect(properties).toHaveLength(5)

      expectProperty(properties[0], 'myImplicitPulicProp', CLASS_MEMBER_VISIBILITY.PUBLIC)
      expectProperty(properties[1], 'myExplicitPulicProp', CLASS_MEMBER_VISIBILITY.PUBLIC)
      expectProperty(properties[2], 'myProtectedProp', CLASS_MEMBER_VISIBILITY.PROTECTED)
      expectProperty(properties[3], 'myPrivateProp', CLASS_MEMBER_VISIBILITY.PRIVATE)
      expectProperty(properties[4], 'myStaticProp', CLASS_MEMBER_VISIBILITY.PUBLIC, true)
    })

    test('class declaration can have methods', () => {
      const src = `class Foo { 
        fn myImplicitPulicMethod a {}

        public fn myExplicitPulicMethod a {}

        protected fn myProtectedMethod a {}

        private fn myPrivateMethod a {}

        static public fn myStaticMethod a {}
      }`
      const stmts = parseStatements(src)

      expect(stmts[0]).toBeInstanceOf(ClassDeclaration)
      expectSourceContext(stmts[0], {
        endLine: 11,
        endTokenPos: src.length
      })

      const methods = (stmts[0] as ClassDeclaration).body.statements as MethodDefinition[]
      expect(methods).toHaveLength(5)

      expectMethod(methods[0], 'myImplicitPulicMethod', CLASS_MEMBER_VISIBILITY.PUBLIC)
      expectMethod(methods[1], 'myExplicitPulicMethod', CLASS_MEMBER_VISIBILITY.PUBLIC)
      expectMethod(methods[2], 'myProtectedMethod', CLASS_MEMBER_VISIBILITY.PROTECTED)
      expectMethod(methods[3], 'myPrivateMethod', CLASS_MEMBER_VISIBILITY.PRIVATE)
      expectMethod(methods[4], 'myStaticMethod', CLASS_MEMBER_VISIBILITY.PUBLIC, true)
    })
  })

  function expectMethod (method: MethodDefinition, id: string, visibility: CLASS_MEMBER_VISIBILITY, isStatic = false): void {
    expect(method).toBeInstanceOf(MethodDefinition)
    expect(method.params[0]).toBeInstanceOf(Identifier)
    expectMember(method, id, visibility, isStatic)
  }

  function expectProperty (property: PropertyDefinition, id: string, visibility: CLASS_MEMBER_VISIBILITY, isStatic = false): void {
    expect(property).toBeInstanceOf(PropertyDefinition)
    if (property.init !== null) {
      expect(property.init?.type).toBe(AST_NODE_TYPE.LITERAL_EXPRESSION)
    }

    expectMember(property, id, visibility, isStatic)
  }

  function expectMember (member: ClassBodyStatement, id: string, visibility: CLASS_MEMBER_VISIBILITY, isStatic = false): void {
    expect(member.visibility).toBe(visibility)
    expect(member.isStatic).toBe(isStatic)
    expect(member.identifier.name).toBe(id)
  }
}
