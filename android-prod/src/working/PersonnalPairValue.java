package working;


/**
 * use to save 2 type off data in  a Map
 * @author ronan GESTIN
 *
 * @param <T>
 * @param <H>
 */
public class PersonnalPairValue<T,H> {
	
	T type;
	H id;
	
	public PersonnalPairValue(T tp, H id){
		type=tp;
		this.id=id;
		
	}
	
	public T getType(){
		return type;
	}
	
	public H getId()
	{
		return id;
	}

	
	public void setType(T type){
		this.type=type;
	}
	
	public void setId(H id){
		this.id=id;
	}
}
